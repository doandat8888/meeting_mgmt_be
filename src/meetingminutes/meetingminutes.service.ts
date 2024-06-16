import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingMinutes } from './meeting-minutes.entity';
import { Repository } from 'typeorm';
import { UsermeetingsService } from 'src/usermeetings/usermeetings.service';
import { MeetingsService } from 'src/meetings/meetings.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MeetingMinutesService {

    constructor(
        @InjectRepository(MeetingMinutes) private repo: Repository<MeetingMinutes>,
        private userMeetingService: UsermeetingsService,
        private meetingService: MeetingsService,
        private userService: UsersService
    ) {}

    async create(name: string, link: string, meetingId: string, userId: string) {
        try {
            let meetingminutes = await this.repo.create({
                name,
                link,
                meetingId,
                createdBy: userId,
                updatedBy: userId
            });
            return this.repo.save(meetingminutes);
        } catch (error: any) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
    }

    async findByMeetingId(meetingId: string): Promise<MeetingMinutes[]> {
        try {
            let meetingminutes = await this.repo.find({
                where: {
                    meetingId
                }
            });
            if(!meetingminutes) {
                throw new BadRequestException("Meeting minutes not found");
            }
            return meetingminutes;
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
    }

    async findMeetingMinutesCurrent(userId: string) {
        try {
            let meetingsAttend = await this.userMeetingService.getMeetingsAttend(userId);
            if(!meetingsAttend) {
                throw new BadRequestException("Meetings not found");
            }
            let meetingMinutesList = [];
            for(let meeting of meetingsAttend) {
                let meetingMinutes = await this.repo.find({ where: { meetingId: meeting.id } });
                if(meetingMinutes) {
                    const meetingMinutesWithMeeting = await Promise.all(meetingMinutes.map(async (meetingMinute) => {
                        const meeting = await this.meetingService.findOne(meetingMinute.meetingId);
                        const user = await this.userService.findOneById(meetingMinute.createdBy);
                        return meeting && user ? {
                            ...meetingMinute,
                            meetingTitle: meeting.title,
                            userCreateName: user.fullName
                        } : meetingMinute;
                    }));
                    meetingMinutesList.push(...meetingMinutesWithMeeting);
                }
            }
            return meetingMinutesList;
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
    }

    async findLatest(meetingId: string): Promise<MeetingMinutes>{
        try {
            let meetingMinutes = await this.repo.find({ where: { meetingId } });
            if(!meetingMinutes) {
                throw new BadRequestException("Meeting minutes not found");
            }
            return meetingMinutes[meetingMinutes.length - 1];
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.response.message);
        }
    }

    async findAll(): Promise<MeetingMinutes[]>{
        return this.repo.find();
    }
}
