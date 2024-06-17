import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
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
        return this.meetingMinutesService.create(createMeetingMinutesDto.name, createMeetingMinutesDto.link, createMeetingMinutesDto.publicId, createMeetingMinutesDto.meetingId, currentUser.id);
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

    @Get('/current')
    @UseGuards(AttendGuard)
    async findMeetingMinutesCurrent(@CurrentUser() currentUser: User) {
        return this.meetingMinutesService.findMeetingMinutesCurrent(currentUser.id);
    }

    @Delete('/:meetingId')
    async delete(@Param('meetingMinutesId') meetingMinutesId: string, @CurrentUser() currentUser: User) {
        const meetingMinute = await this.meetingMinutesService.findOne(meetingMinutesId);
        if(!meetingMinute) {
            throw new BadRequestException('Meeting minutes not found');
        }
        if(meetingMinute.createdBy !== currentUser.id) throw new UnauthorizedException();
        return this.meetingMinutesService.delete(meetingMinute);
    }
}
