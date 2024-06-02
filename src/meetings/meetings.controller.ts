import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUserInterceptor } from 'src/interceptors/current-user.interceptor';
import { User } from 'src/users/user.entity';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { MeetingsService } from './meetings.service';
import { UpdateMeetingDto } from './dtos/update.meeting.dto';
import { Meeting } from './meeting.entity';

@Controller('meetings')
@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
export class MeetingsController {

    constructor(private meetingService: MeetingsService) {}
    
    @Get('/')
    getAllMeetings(@CurrentUser() currentUser: User): string {
        if(currentUser.role !== 'admin') {
            throw new UnauthorizedException();
        }
        return 'This is meeting route';
    }

    @Post('/create')
    create(@Body() createMeetingDto: CreateMeetingDto, @CurrentUser() currentUser: User) {
        return this.meetingService.create(createMeetingDto, currentUser.id);
    }

    @Get('/filter')
    async searchMeeting(@Query() searchParams) {
        return this.meetingService.search(searchParams);
    }

    @Get('/:id')
    findOne(@Param('id') meetingId: string) {
        return this.meetingService.findOne(meetingId);
    }

    @Patch('/update/:id')
    async update(@Param('id') meetingId: string, @Body() updateMeetingDto: UpdateMeetingDto, @CurrentUser() currentUser: User) {
        const meeting = await this.meetingService.findOne(meetingId);
        if(!meeting) {
            throw new BadRequestException('Meeting not found');
        }
        if(meeting.createdBy !== currentUser.id) throw new UnauthorizedException();
        return this.meetingService.update(meeting, updateMeetingDto, currentUser.id);
    }

    @Delete('/delete/:id')
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
