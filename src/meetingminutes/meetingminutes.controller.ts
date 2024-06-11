import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateMeetingMinutesDto } from './dtos/create-meeting-minutes.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { MeetingOwnerGuard } from 'src/guards/meeting-owner.guard';
import { MeetingMinutesService } from './meetingminutes.service';
import { AttendGuard } from 'src/guards/attendees.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('meetingminutes')
@UseGuards(AuthGuard)
export class MeetingminutesController {

    constructor(private meetingMinutesService: MeetingMinutesService) { }

    @UseGuards(MeetingOwnerGuard)
    @Post('/')
    create(@Body() createMeetingMinutesDto: CreateMeetingMinutesDto, @CurrentUser() currentUser: User) {
        return this.meetingMinutesService.create(createMeetingMinutesDto.name, createMeetingMinutesDto.link, createMeetingMinutesDto.meetingId, currentUser.id);
    }

    @Get('/')
    @UseGuards(AdminGuard)
    findAll() {
        return this.meetingMinutesService.findAll();
    }

    @Get('/latest/:meetingId')
    @UseGuards(AttendGuard)
    async findLatest(@Param('meetingId') meetingId: string) {
        return this.meetingMinutesService.findLatest(meetingId);
    }
}
