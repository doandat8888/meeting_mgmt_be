import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMeeting } from './usermeeting.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { MeetingsService } from 'src/meetings/meetings.service';
import { Meeting } from 'src/meetings/meeting.entity';
import { MailerService } from '@nest-modules/mailer';
import { format } from 'date-fns';

@Injectable()
export class UsermeetingsService {

    constructor(
        @InjectRepository(UserMeeting) private repo: Repository<UserMeeting>,
        private userService: UsersService,
        @Inject(forwardRef(() => MeetingsService)) private meetingService: MeetingsService,
        private mailerService: MailerService
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
                    if (meeting && userId !== meeting.createdBy) {
                        meetings.push(meeting);  //Just add user involved in the meeting, 
                    }
                }
            }
            let meetingsCreated = await this.meetingService.findByUserId(userId);
            meetings.push(...meetingsCreated); //Add user created the meeting
            // I do so because sometimes the user created the meeting is not in the meeting
            return meetings;
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
    }

    async updateAttendStatus(userId: string, meetingId: string, status: string): Promise<UserMeeting | undefined> {
        try {
            const usermeeting = await this.repo.findOne({
                where: {
                    userId,
                    meetingId
                }
            });
            if(usermeeting) {
                if(status === 'accepted') {
                    usermeeting.attendStatus = '1';
                }else if(status === 'rejected') {
                    usermeeting.attendStatus = '2';
                }
                return this.repo.save(usermeeting);
            }
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
        
    }

    async getAttendees(meetingId: string): Promise<any> {
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
                    const userRes = {
                        ...user,
                        attendStatus: userMeeting.attendStatus
                    }
                    users.push(userRes);
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
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: currentUserId,
                updatedBy: currentUserId,
                attendStatus: '0' //Waiting for acceptance
            });
            const user = await this.userService.findOneById(userId);
            const meeting = await this.meetingService.findOne(meetingId);
            const formattedDatetime = format(meeting.startTime, "yyyy-MM-dd HH:mm");
            const separatedDateAndTime = formattedDatetime.split(" ");
            const acceptUrl = `http://localhost:8000/usermeetings/changeStatus?userId=${userId}&meetingId=${meetingId}&status=accepted`
            const rejectUrl = `http://localhost:8000/usermeetings/changeStatus?userId=${userId}&meetingId=${meetingId}&status=rejected`
            if(user) {
                await this.mailerService.sendMail({
                    to: user.email,
                    subject: `Invitation to meeting: ${meeting.title}`,
                    template: 'invitation',
                    context: {
                        name: user.fullName,
                        meetingTitle: meeting.title,
                        date: separatedDateAndTime[0],
                        time: separatedDateAndTime[1],
                        location: meeting.location,
                        acceptUrl,
                        rejectUrl
                    }
                })
            }
            return this.repo.save(userMeeting);
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error);
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
