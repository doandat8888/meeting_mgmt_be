import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMeeting } from './usermeeting.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { MeetingsService } from 'src/meetings/meetings.service';
import { Meeting } from 'src/meetings/meeting.entity';

@Injectable()
export class UsermeetingsService {

    constructor(
        @InjectRepository(UserMeeting) private repo: Repository<UserMeeting>,
        private userService: UsersService,
        private meetingService: MeetingsService
    ) { }

    async findOne(userId: string, meetingId: string): Promise<UserMeeting> {
        return await this.repo.findOne({ where: { userId, meetingId } });
    }

    async getMeetingsAttend(userId: string) {
        try {
            const meetings: Meeting[] = [];
            const usermeetings = await this.repo.find({ where: { userId } });
            if (usermeetings) {
                for (let usermeeting of usermeetings) {
                    let meeting = await this.meetingService.findOne(usermeeting.meetingId);
                    if (meeting) {
                        meetings.push(meeting);
                    }
                }
            }
            const meetingCreated = await this.meetingService.findByUserId(userId);
            if(meetingCreated) {
                meetings.push(...meetingCreated);
            }
            return meetings;
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
    }

    async getAttendees(meetingId: string): Promise<User[]> {
        try {
            let userMeetings = await this.repo.find({
                where: {
                    meetingId
                }
            });
            const users = [];
            for (let userMeeting of userMeetings) {
                const user = await this.userService.findOneById(userMeeting.userId);
                if (user) {
                    users.push(user);
                }
            }
            return users;
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
    }

    async create(userId: string, meetingId: string, currentUserId: string) {
        try {
            let existUser = await this.repo.findOne({
                where: {
                    userId,
                    meetingId
                }
            });
            if (existUser) {
                throw new BadRequestException('User already in meeting');
            }

            const userMeeting = await this.repo.create({
                userId,
                meetingId,
                createdBy: currentUserId,
                updatedBy: currentUserId
            });
            return this.repo.save(userMeeting);
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.response.message);
        }
    }

    async remove(userId: string, meetingId: string) {
        try {
            let userMeeting = await this.repo.findOne({
                where: {
                    userId,
                    meetingId
                }
            });
            if (!userMeeting) {
                throw new BadRequestException('User not in meeting');
            }
            return this.repo.remove(userMeeting);
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
    }
}
