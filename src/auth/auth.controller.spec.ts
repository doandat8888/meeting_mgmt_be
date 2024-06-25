import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CustomLoggerService } from 'src/logger/logger.service';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let jwtService: JwtService;
    let usersService: UsersService;
    let customLoggerService: CustomLoggerService;

    const mockAuthService = {
        signIn: jest.fn(),
        signUp: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
        sign: jest.fn(),
    };

    const mockUsersService = {
        findOne: jest.fn(),
    };

    const mockCustomLoggerService = {
        log: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: UsersService, useValue: mockUsersService },
                { provide: CustomLoggerService, useValue: mockCustomLoggerService }
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        usersService = module.get<UsersService>(UsersService);
        customLoggerService = module.get<CustomLoggerService>(CustomLoggerService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('signIn', () => {
        it('should call authService.signIn with correct parameters', async () => {
            const createUserDto: Partial<CreateUserDto> = {
                email: 'test@example.com',
                password: 'password',
            };

            const result = {
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
            };

            mockAuthService.signIn.mockResolvedValue(result);

            expect(await authController.signIn(createUserDto)).toEqual(result);
            expect(authService.signIn).toHaveBeenCalledWith(
                createUserDto.email,
                createUserDto.password,
            );
        });

        it('should throw a BadRequestException if authService.signIn throws one', async () => {
            const createUserDto: Partial<CreateUserDto> = {
                email: 'test@example.com',
                password: 'password',
            };

            mockAuthService.signIn.mockRejectedValue(new BadRequestException('Invalid credentials'));

            await expect(authController.signIn(createUserDto)).rejects.toThrow(
                new BadRequestException('Invalid credentials'),
            );
        });

        it('should handle unexpected errors gracefully', async () => {
            const createUserDto: Partial<CreateUserDto> = {
                email: 'test@example.com',
                password: 'password',
            };

            mockAuthService.signIn.mockRejectedValue(new Error('Unexpected error'));

            await expect(authController.signIn(createUserDto)).rejects.toThrow(
                new Error('Unexpected error'),
            );
        });
    });

    describe('signUp', () => {
        it('should call authService.signUp with correct parameters', async () => {
            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password',
                fullName: 'Test'
            };

            const result = {
                ...createUserDto,
                password: 'hashedpassword',
            }

            mockAuthService.signUp.mockResolvedValue(result);
            expect(await authController.signup(createUserDto)).toEqual(result);
            expect(authService.signUp).toHaveBeenCalledWith(
                createUserDto.email,
                createUserDto.password,
                createUserDto.fullName
            );
        });
    })
});
