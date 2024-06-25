import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { comparePassword, hashPassword } from 'src/utils/hash-password.util';
import { CustomLoggerService } from 'src/logger/logger.service';

jest.mock('src/utils/hash-password.util');

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;
    let customLoggerService: CustomLoggerService

    const mockUsersService = {
        findOne: jest.fn(),
        create: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
        sign: jest.fn(),
        verifyAsync: jest.fn(),
        verify: jest.fn(),
    };

    const mockLogger = {
        error: jest.fn(),
        log: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: CustomLoggerService, useValue: mockLogger },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
        customLoggerService = module.get<CustomLoggerService>(CustomLoggerService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('signIn', () => {
        it('should throw an error if user is not found', async () => {
            mockUsersService.findOne.mockResolvedValue(null);

            await expect(authService.signIn('test@example.com', 'password')).rejects.toThrow(
                new BadRequestException('User not found'),
            );
            expect(mockLogger.error).toHaveBeenCalledWith('User not found when login');
        });

        it('should throw an error if password is incorrect', async () => {
            const user = { email: 'test@example.com', password: 'hashedpassword' };
            mockUsersService.findOne.mockResolvedValue(user);
            (comparePassword as jest.Mock).mockResolvedValue(false);

            await expect(authService.signIn('test@example.com', 'password')).rejects.toThrow(
                new BadRequestException('Wrong password'),
            );
            expect(mockLogger.error).toHaveBeenCalledWith('Wrong password when login');
        });

        it('should return accessToken and refreshToken if login is successful', async () => {
            const user = { email: 'test@example.com', password: 'hashedpassword' };
            mockUsersService.findOne.mockResolvedValue(user);
            (comparePassword as jest.Mock).mockResolvedValue(true);
            mockJwtService.signAsync.mockResolvedValue('accessToken');
            mockJwtService.sign.mockReturnValue('refreshToken');

            const result = await authService.signIn('test@example.com', 'password');

            expect(result).toEqual({
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
            });
            expect(mockLogger.log).toHaveBeenCalledWith('User test@example.com signed in successfully');
        });

        it('should throw an error if jwtService.signAsync fails', async () => {
            const user = { email: 'test@example.com', password: 'hashedpassword' };
            mockUsersService.findOne.mockResolvedValue(user);
            (comparePassword as jest.Mock).mockResolvedValue(true);
            mockJwtService.signAsync.mockRejectedValue(new Error('Signing error'));

            await expect(authService.signIn('test@example.com', 'password')).rejects.toThrow(
                new BadRequestException('Internal server error'),
            );
            expect(mockLogger.error).toHaveBeenCalledWith('Error when signing token', expect.any(String));
        });
    })

    describe('signUp', () => {
        it('should throw an error if user is already exist', async () => {
            mockUsersService.findOne.mockResolvedValue({ email: 'test@example.com' });
            await expect(authService.signUp('test@example.com', '123456', 'Dat Doan')).rejects.toThrow(
                new BadRequestException('Email already in use'),
            )
            expect(mockLogger.error).toHaveBeenCalledWith('Email already in use when sign up');
        });

        it('should return user if sign up is successful', async () => {
            mockUsersService.findOne.mockResolvedValue(null);
            const user = { email: 'test1@example.com', password: '123456', fullName: 'Test' };
            const hashedPassword = 'hashedpassword';
            (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
            mockUsersService.create.mockResolvedValue({
                ...user,
                password: hashedPassword,
            });
            const result = await authService.signUp('test1@example.com', '123456', 'Test');
            expect(result).toEqual({
                email: 'test1@example.com',
                password: hashedPassword,
                fullName: 'Test'
            });
            expect(mockLogger.log).toHaveBeenCalledWith('User test1@example.com signed up successfully');
        });
    });

    describe('refreshToken', () => {
        it('should throw an error if refresh token is invalid', async () => {
            mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));
            await expect(authService.refreshToken('refreshToken')).rejects.toThrow(
                new BadRequestException('Internal server error'),
            );
            expect(mockLogger.error).toHaveBeenCalledWith('Error when refreshing token', expect.any(String));
        });

        it('should throw an error if user is not found', async() => {
            const payload = { email: 'test@example.com' };
            mockJwtService.verifyAsync.mockResolvedValue(payload);
            mockUsersService.findOne.mockResolvedValue(null);
            await expect(authService.refreshToken('refreshToken')).rejects.toThrow(
                new BadRequestException('User not found'),
            );
            expect(mockLogger.error).toHaveBeenCalledWith('User not found during token refresh');
        });

        it('should return new accessToken and refreshToken', async() => {
            const payload = { email: 'test@example.com' };
            mockJwtService.verifyAsync.mockResolvedValue(payload);
            const user = { email: payload.email, password: 'hashedpassword', fullName: 'Dat Doan' };
            mockUsersService.findOne.mockResolvedValue(user);
            mockJwtService.signAsync.mockResolvedValue('accessToken');
            mockJwtService.sign.mockReturnValue('refreshToken');

            const result = await authService.refreshToken('refreshToken');
            expect(result).toEqual({
                accessToken: 'accessToken',
                refreshToken:'refreshToken',
            })
            expect(mockLogger.log).toHaveBeenLastCalledWith('User test@example.com refreshed token successfully')
        });

        it('should throw an error if jwtService.signAsync fails', async () => {
            const payload = { email: 'test@example.com' };
            mockJwtService.verifyAsync.mockResolvedValue(payload);
            const user = { email: payload.email, password: 'hashedpassword', fullName: 'Dat Doan' };
            mockUsersService.findOne.mockResolvedValue(user);
            mockJwtService.signAsync.mockRejectedValue(new Error('Signing error'));

            await expect(authService.refreshToken('refreshToken')).rejects.toThrow(
                new BadRequestException('Internal server error'),
            );
            expect(mockLogger.error).toHaveBeenCalledWith('Error when refreshing token', expect.any(String));
        });
    })
});
