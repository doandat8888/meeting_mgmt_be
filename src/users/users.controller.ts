import { Body, Controller, Get, Param, Patch, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUserInterceptor } from 'src/interceptors/current-user.interceptor';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Serialize(UserDto)
    @Patch(':email')
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
    @Get('')
    getAllUsers(@CurrentUser() currentUser: User) {
        if(currentUser.role !== 'admin') throw new UnauthorizedException();
        return this.userService.findAll();
    }
}
