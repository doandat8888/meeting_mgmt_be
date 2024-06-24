import { Body, Controller, Delete, Get, Param, Post, Query, Res, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserMeetingDto } from './dtos/create-user-meeting.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { MeetingsService } from 'src/meetings/meetings.service';
import { UsermeetingsService } from './usermeetings.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { UserWithAttendStatusDto } from 'src/users/dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AttendGuard } from 'src/guards/attendees.guard';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';

@Controller('usermeetings')
@UseGuards(AuthGuard)

export class UsermeetingsController {

    constructor(
        private meetingService: MeetingsService,
        private userMeetingService: UsermeetingsService
    ) {}

    @UseGuards(AttendGuard)
    @Serialize(UserWithAttendStatusDto)
    @Get('/attendees/:meetingId')
    async getAttendees(@Param('meetingId') meetingId: string) {
        return this.userMeetingService.getAttendees(meetingId);
    }

    @Post('/')
    async create(@Body() createUserMeetingDto: CreateUserMeetingDto, @CurrentUser() currentUser: User) {
        const meeting = await this.meetingService.findOne(createUserMeetingDto.meetingId);
        if(meeting.createdBy !== currentUser.id) throw new UnauthorizedException();
        return this.userMeetingService.create(createUserMeetingDto.userId, createUserMeetingDto.meetingId, currentUser.id);
    }

    @Delete('/')
    async remove(@Query('userId') userId: string, @Query('meetingId') meetingId: string, @CurrentUser() currentUser: User){
        const meeting = await this.meetingService.findOne(meetingId);
        if(meeting.createdBy !== currentUser.id) throw new UnauthorizedException();
        return this.userMeetingService.remove(userId, meetingId);
    }

    @Get('/meetings/attend')
    async getMeetingsAttend(@CurrentUser() currentUser: User) {
        return this.userMeetingService.getMeetingsAttend(currentUser.id);
    }

    @Public()
    @Get('/changeStatus')
    async updateAttendStatus(@Res() res: Response, @Query('userId') userId: string, @Query('meetingId') meetingId: string, @Query('status') status: string) {
        const userMeetingUpdate = await this.userMeetingService.updateAttendStatus(userId, meetingId, status);
        if(userMeetingUpdate) {
            return res.redirect('http://localhost:3000/dashboard');
        }
    }
}
