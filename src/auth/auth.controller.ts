import {
    Body,
    Controller,
    Post,
    Res,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    signIn(
        @Body() createUserDto: Partial<CreateUserDto>,
    ) {
        return this.authService.signIn(
            createUserDto.email,
            createUserDto.password,
        );
    }

    @Serialize(UserDto)
    @Post('register')
    signup(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.authService.signUp(
            createUserDto.email,
            createUserDto.password,
            createUserDto.fullName,
        );
    }

    @Post('refresh-token')
    async refreshToken(
        @Body() req,
    ) {
        return this.authService.refreshToken(req.refreshToken);
    }

    // @UseGuards(AuthGuard)
    // @Post('logout')
    // signOut(@Res({ passthrough: true }) response: Response) {
    //     return this.authService.signOut(response);
    // }
}
