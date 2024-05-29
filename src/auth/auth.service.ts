import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { comparePassword, hashPassword } from 'src/utils/hash-password.util';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signIn(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const exactPassword = await comparePassword(user, password);
        if (!exactPassword) {
            throw new BadRequestException('Wrong password');
        }
        try {
            const payload = {
                email: user.email,
                role: user.role
            }
            const token = await this.jwtService.signAsync(payload);
            return {
                accessToken: token,
                refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' })
            };
        } catch (error) {
            console.log("Error when sign token: ", error);
            throw new BadRequestException("Internal server error");
        }
    }

    async signUp(email: string, password: string, full_name: string) {
        // check if email already exist
        const userExist = await this.usersService.findOne(email);
        if (userExist) {
            throw new BadRequestException('Email already in use');
        }
        const passwordHash = await hashPassword(password);

        try {
            const user = await this.usersService.create(email, passwordHash, full_name);
            return user;
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal error");
        }
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(
                refreshToken,
                {
                    secret: process.env.JWT_SECRET
                }    
            )
            const user = await this.usersService.findOne(payload.email);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            const newPayload = {
                email: user.email,
                role: user.role
            }
            const token = await this.jwtService.signAsync(newPayload);
            return {
                accessToken: token,
                refresh_token: this.jwtService.sign(newPayload, { expiresIn: '7d' })
            };
        } catch (e) {
            console.log("Error when refresh token: ", e);
            throw new UnauthorizedException('Internal server error');
        }
    }
}
