import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { comparePassword, hashPassword } from 'src/utils/hash-password.util';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signIn(email: string, password: string, response: Response): Promise<any> {
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
                email: user.email
            }
            const token = await this.jwtService.signAsync(payload);
            const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });
            this.setCookie(response, token, refreshToken);
            return {
                accessToken: token,
                refreshToken: refreshToken
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
            throw new BadRequestException("Internal server error");
        }
    }

    async refreshToken(refreshToken: string, response: Response) {
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
                email: user.email
            }
            const token = await this.jwtService.signAsync(newPayload);
            const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '1d' });
            this.setCookie(response, token, refreshToken);
            return {
                accessToken: token,
                refreshToken: newRefreshToken,
            };
        } catch (e) {
            console.log("Error when refresh token: ", e);
            throw new UnauthorizedException('Internal server error');
        }
    }

    setCookie(response: Response, accessToken: string, refreshToken: string) {
        response.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 3600000 // 1 hour in milliseconds for accessToken
        });

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 86400000 // 1 day in milliseconds for refreshToken
        });
    }

    async signOut(response: Response): Promise<any> {
        response.clearCookie('accessToken');
        response.clearCookie('refreshToken');
        return { message: 'Logged out successfully'}
    }
}
