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
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(
      createUserDto.email,
      createUserDto.password,
      response,
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

  @UseGuards(AuthGuard)
  @Post('refresh-token')
  async refreshToken(
    @Body() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshToken(req.refreshToken, response);
  }

  // @UseGuards(AuthGuard)
  // @Post('logout')
  // signOut(@Res({ passthrough: true }) response: Response) {
  //     return this.authService.signOut(response);
  // }
}
