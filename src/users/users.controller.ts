import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Query, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUserInterceptor } from 'src/interceptors/current-user.interceptor';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { role } from './enums/role.enum';

@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
@Serialize(UserDto)

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    @Patch('/:email')
    updateUser(@Param('email') email: string, @Body() updateUserDto: Partial<UpdateUserDto>, @CurrentUser() currentUser: User) {
        if(currentUser.email === email || currentUser.role === role.admin) return this.userService.updateUser(updateUserDto, email);
        throw new UnauthorizedException();
    }
    @Get('/filter')
    async searchMeeting(@Query() searchParams) {
        return this.userService.search(searchParams);
    }
    @Get('profile')
    getCurrentUser(@CurrentUser() currentUser: User) {
        return currentUser;
    }
    @Get('')
    getAllUsers(@CurrentUser() currentUser: User) {
        if(currentUser.role !== role.admin) throw new UnauthorizedException();
        return this.userService.findAll();
    }

    @Get('/:id')
    getUserById(@Param('id') id: string) {
        return this.userService.findOneById(id);
    }

    @Delete('/:id')
    async delete(@Param('id') userId: string, @CurrentUser() currentUser: User) {
        const user = await this.userService.findOneById(userId);
        if(!user) {
            throw new BadRequestException('User not found');
        }
        if(currentUser.role !== role.admin) throw new UnauthorizedException();
        return this.userService.softDelete(user);
    }

    @Get('/recover/:id')
    async recover(@Param('id') userId: string, @CurrentUser() currentUser: User) {
        const user = await this.userService.findOneDeleted(userId);
        if(currentUser.role !== role.admin) throw new UnauthorizedException();
        return this.userService.recover(user);
    }
}
