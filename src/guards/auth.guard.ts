import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    private retryCount = 0;

    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const accessToken = this.extractTokenFromHeader(request);
        //const refreshToken = request.cookies.refreshToken;

        if (!accessToken) {
            throw new UnauthorizedException();
        }

        const payload = await this.jwtService.verifyAsync(accessToken, {
            secret: process.env.JWT_SECRET,
        });
        const { email } = payload;
        const user = await this.userService.findOne(email);
        request['user'] = user;
        return true;

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
