import { Body, Controller, Get, Post, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUserInterceptor } from 'src/interceptors/current-user.interceptor';
import { User } from 'src/users/user.entity';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { MeetingsService } from './meetings.service';

@Controller('meetings')
export class MeetingsController {

    constructor(private meetingService: MeetingsService) {}
    
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Get('/')
    getAllMeetings(@CurrentUser() currentUser: User): string {
        if(currentUser.role !== 'admin') {
            throw new UnauthorizedException();
        }
        return 'This is meeting route';
    }

    @Post('/create')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    create(@Body() createMeetingDto: CreateMeetingDto, @CurrentUser() currentUser: User) {
        return this.meetingService.create(createMeetingDto, currentUser.id);
    }
}
