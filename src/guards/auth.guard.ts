import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { CustomLoggerService } from 'src/logger/logger.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private retryCount = 0;

    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private userService: UsersService,
        private readonly logger: CustomLoggerService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            this.logger.log(`AuthGuard: Confirm public route`);
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const accessToken = this.extractTokenFromHeader(request);

    if (!accessToken) {
      this.logger.warn('AuthGuard: No access token found in request headers');
      throw new UnauthorizedException();
    }

        try {
            const payload = await this.jwtService.verifyAsync(accessToken, {
                secret: process.env.JWT_SECRET,
            });
            const { email } = payload;
            const user = await this.userService.findOne(email);
            request['user'] = user;
            this.logger.log(`AuthGuard: User ${email} authenticated successfully`);
            return true;
        } catch (error) {
            this.logger.error('AuthGuard: Authentication failed', error);
            throw new UnauthorizedException();
        }

    // if (!accessToken && refreshToken && this.retryCount === 0) {
    //     this.retryCount++;
    //     throw new UnauthorizedException();
    // }

    // try {
    //     if (accessToken) {
    //         const payload = await this.jwtService.verifyAsync(accessToken, {
    //             secret: process.env.JWT_SECRET,
    //         });
    //         const { email } = payload;
    //         const user = await this.userService.findOne(email);
    //         request['user'] = user;
    //         this.retryCount = 0; // Reset retry count on successful access token verification
    //         return true;
    //     }
    // } catch (e) {
    //     // If access token verification fails, proceed to check refresh token
    //     console.log('Access token verification failed', e);
    // }

    // If accessToken failed, try refreshToken
    // if (refreshToken && this.retryCount > 0) {
    //   try {
    //     const payload = await this.jwtService.verifyAsync(refreshToken, {
    //       secret: process.env.JWT_SECRET,
    //     });
    //     const { email } = payload;
    //     const user = await this.userService.findOne(email);
    //     request['user'] = user;
    //     this.retryCount = 0; // Reset retry count on successful refresh token verification
    //     return true;
    //   } catch (e) {
    //     console.log('Refresh token verification failed', e);
    //     throw new UnauthorizedException();
    //   }
    // }

    //throw new UnauthorizedException();
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
