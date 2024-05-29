import { Body, Controller, Get, Param, Patch, Post, Query, Request, UnauthorizedException, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersService } from 'src/users/users.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CurrentUserInterceptor } from 'src/interceptors/current-user.interceptor';
import { User } from 'src/users/user.entity';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';

@Controller('auth')

export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
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
    @UseInterceptors(CurrentUserInterceptor)
    @Serialize(UserDto)
    @Patch('update/:email')
    updateUser(@Param('email') email: string, @Body() updateUserDto: Partial<UpdateUserDto>, @CurrentUser() currentUser: User) {
        if(currentUser.email !== email) throw new UnauthorizedException();
        return this.userService.updateUser(updateUserDto, email);
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Serialize(UserDto)
    @Get('profile')
    getCurrentUser(@CurrentUser() currentUser: User) {
        return currentUser;
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Serialize(UserDto)
    @Get('admin/users')
    getAllUsers(@CurrentUser() currentUser: User) {
        if(currentUser.role !== 'admin') throw new UnauthorizedException();
        return this.userService.findAll();
    }

    @UseGuards(AuthGuard)
    @Post('refresh-token')
    refreshToken(@Body() req) {
        return this.authService.refreshToken(req.refreshToken)
    }
}
