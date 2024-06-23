import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CustomLoggerService } from 'src/logger/logger.service';
import { UsersService } from 'src/users/users.service';
import { comparePassword, hashPassword } from 'src/utils/hash-password.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly logger: CustomLoggerService,
  ) {}

  async signIn(
    email: string,
    password: string,
    response: Response,
  ): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      this.logger.error('User not found when login');
      throw new BadRequestException('User not found');
    }
    const exactPassword = await comparePassword(user, password);
    if (!exactPassword) {
      this.logger.error('Wrong password when login');
      throw new BadRequestException('Wrong password');
    }
    try {
      const payload = {
        email: user.email,
      };
      const token = await this.jwtService.signAsync(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });
      //this.setCookie(response, token, refreshToken);
      this.logger.log(`User ${email} signed in successfully`);
      return {
        accessToken: token,
        refreshToken: refreshToken,
      };
    } catch (error) {
      this.logger.error('Error when signing token', error.stack);
      throw new BadRequestException('Internal server error');
    }
  }

  async signUp(email: string, password: string, full_name: string) {
    // check if email already exist
    const userExist = await this.usersService.findOne(email);
    if (userExist) {
      this.logger.error('Email already in use when sign up');
      throw new BadRequestException('Email already in use');
    }
    const passwordHash = await hashPassword(password);

    try {
      const user = await this.usersService.create(
        email,
        passwordHash,
        full_name,
      );
      this.logger.log(`User ${email} signed up successfully`);
      return user;
    } catch (error) {
      this.logger.error('Error during sign up', error.stack);
      throw new BadRequestException('Internal server error');
    }
  }

  async refreshToken(refreshToken: string, response: Response) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.usersService.findOne(payload.email);
      if (!user) {
        this.logger.error('User not found during token refresh');
        throw new UnauthorizedException('User not found');
      }
      const newPayload = {
        email: user.email,
      };
      const token = await this.jwtService.signAsync(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '1d',
      });
      //this.setCookie(response, token, newRefreshToken);
      this.logger.log(`User ${user.email} refreshed token successfully`);
      return {
        accessToken: token,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      this.logger.error('Error when refreshing token', e.stack);
      throw new UnauthorizedException('Internal server error');
    }
  }

  // setCookie(response: Response, accessToken: string, refreshToken: string) {
  //     response.cookie('accessToken', accessToken, {
  //         httpOnly: true,
  //         secure: true,
  //         sameSite: "lax",
  //         maxAge: 3600000 // 1 hour in milliseconds for accessToken
  //     });

  //     response.cookie('refreshToken', refreshToken, {
  //         httpOnly: true,
  //         secure: true,
  //         sameSite: "lax",
  //         maxAge: 86400000 // 1 day in milliseconds for refreshToken
  //     });
  // }

  //   async signOut(response: Response): Promise<any> {
  //     response.clearCookie('accessToken');
  //     response.clearCookie('refreshToken');
  //     this.logger.log('User logged out successfully');
  //     return { message: 'Logged out successfully' };
  //   }
}
