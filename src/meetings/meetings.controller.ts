import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UnauthorizedException, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { MeetingsService } from './meetings.service';
import { UpdateMeetingDto } from './dtos/update.meeting.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { AttendGuard } from 'src/guards/attendees.guard';

@Controller('meetings')
@UseGuards(AuthGuard)
export class MeetingsController {

    constructor(private meetingService: MeetingsService) {}
    
    @Get('/')
    @UseGuards(AdminGuard)
    getAllMeetings(): string {
        return 'This is meeting route';
    }

    @Get('/current')
    getCurrentMeetings(@CurrentUser() currentUser: User) {
        return this.meetingService.findByUserId(currentUser.id);
    }

    @Post('/')
    create(@Body(ValidationPipe) createMeetingDto: CreateMeetingDto, @CurrentUser() currentUser: User) {
        return this.meetingService.create(createMeetingDto, currentUser.id);
    }

    @Get('/filter')
    async searchMeeting(@Query() searchParams) {
        return this.meetingService.search(searchParams);
    }

    @UseGuards(AttendGuard)
    @Get('/:id')
    findOne(@Param('id') meetingId: string) {
        return this.meetingService.findOne(meetingId);
    }

    @Patch('/:id')
    async update(@Param('id') meetingId: string, @Body() updateMeetingDto: UpdateMeetingDto, @CurrentUser() currentUser: User) {
        const meeting = await this.meetingService.findOne(meetingId);
        if(!meeting) {
            throw new BadRequestException('Meeting not found');
        }
        if(meeting.createdBy !== currentUser.id) throw new UnauthorizedException();
        return this.meetingService.update(meeting, updateMeetingDto, currentUser.id);
    }

    @Delete('/:id')
    async delete(@Param('id') meetingId: string, @CurrentUser() currentUser: User) {
        const meeting = await this.meetingService.findOne(meetingId);
        if(!meeting) {
            throw new BadRequestException('Meeting not found');
        }
        if(meeting.createdBy !== currentUser.id) throw new UnauthorizedException();
        return this.meetingService.softDelete(meeting);
    }

    @Get('/recover/:id')
    async recover(@Param('id') meetingId: string, @CurrentUser() currentUser: User) {
        const meeting = await this.meetingService.findOneDeleted(meetingId);
        if(meeting.createdBy !== currentUser.id) throw new UnauthorizedException();
        return this.meetingService.recover(meeting);
    }
}
