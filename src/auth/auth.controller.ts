import { Body, Controller, Get, Param, Patch, Post, Query, Request, UnauthorizedException, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';

@Controller('auth')

export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('login')
    signIn(@Body() createUserDto: CreateUserDto) {
        return this.authService.signIn(createUserDto.email, createUserDto.password);
    }
    
    @Serialize(UserDto)
    @Post('register')
    signup(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.authService.signUp(createUserDto.email, createUserDto.password, createUserDto.full_name);
    }

    @UseGuards(AuthGuard)
    @Post('refresh-token')
    refreshToken(@Body() req) {
        return this.authService.refreshToken(req.refreshToken)
    }
}
