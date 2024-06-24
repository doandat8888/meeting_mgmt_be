import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMeeting } from './usermeeting.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { MeetingsService } from 'src/meetings/meetings.service';
import { CustomLoggerService } from 'src/logger/logger.service';
import { Meeting } from 'src/meetings/meeting.entity';
import { MailerService } from '@nest-modules/mailer';
import { format } from 'date-fns';

@Injectable()
export class UsermeetingsService {
  constructor(
    @InjectRepository(UserMeeting) private repo: Repository<UserMeeting>,
    private userService: UsersService,
    @Inject(forwardRef(() => MeetingsService))
    private meetingService: MeetingsService,
    private mailerService: MailerService,
    private readonly logger: CustomLoggerService,
  ) {}

  async findOne(userId: string, meetingId: string): Promise<UserMeeting> {
    const res = await this.repo.findOne({ where: { userId, meetingId } });
    if (res) {
      this.logger.log(
        `Successfully find a user meeting with user ID ${userId} and meeting ID ${meetingId}`,
      );
    } else {
      this.logger.error(
        `Fail when finding a user meeting with user ID ${userId} and meeting ID ${meetingId}`,
      );
    }
    return res;
  }

  async getMeetingsAttend(userId: string) {
    try {
      const meetings: Meeting[] = [];
      const usermeetings = await this.repo.find({ where: { userId } });
      if (usermeetings) {
        for (let usermeeting of usermeetings) {
          let meeting = await this.meetingService.findOne(
            usermeeting.meetingId,
          );
          if (meeting && userId !== meeting.createdBy) {
            meetings.push(meeting); //Just add user involved in the meeting,
          }
        }
      }
      let meetingsCreated = await this.meetingService.findByUserId(userId);
      meetings.push(...meetingsCreated); //Add user created the meeting
      // I do so because sometimes the user created the meeting is not in the meeting

      this.logger.log(
        `Successfully get the user meetings where the user ${userId} create or belong to`,
      );
      return meetings;
    } catch (error) {
      this.logger.error(
        `Error when getting the user meetings where the user ${userId} create or belong to: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Internal server error');
    }
  }

  async updateAttendStatus(
    userId: string,
    meetingId: string,
    status: string,
  ): Promise<UserMeeting | undefined> {
    try {
      const usermeeting = await this.repo.findOne({
        where: {
          userId,
          meetingId,
        },
      });
      if (usermeeting) {
        if (status === 'accepted') {
          usermeeting.attendStatus = '1';
        } else if (status === 'rejected') {
          usermeeting.attendStatus = '2';
        }

        this.logger.log(
          `Successfully updated attend status ${status} of user meeting with user ID ${userId} and meeting ID ${meetingId}`,
        );
        return this.repo.save(usermeeting);
      }
    } catch (error) {
      this.logger.error(
        `Error when updating attend status ${status} of user meeting with user ID ${userId} and meeting ID ${meetingId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Internal server error');
    }
  }

  async getAttendees(meetingId: string): Promise<any> {
    try {
      let userMeetings = await this.repo.find({
        where: {
          meetingId,
        },
      });
      const users = [];
      for (let userMeeting of userMeetings) {
        const user = await this.userService.findOneById(userMeeting.userId);
        if (user) {
          const userRes = {
            ...user,
            attendStatus: userMeeting.attendStatus,
          };
          users.push(userRes);
        }
      }

      this.logger.log(
        `Successfully getting attendees in user meeting with meeting ID ${meetingId}`,
      );
      return users;
    } catch (error) {
      this.logger.error(
        `Error when getting attendees in user meeting with meeting ID ${meetingId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Internal server error');
    }
  }

  async create(userId: string, meetingId: string, currentUserId: string) {
    try {
      let existUser = await this.repo.findOne({
        where: {
          userId,
          meetingId,
        },
      });
      if (existUser) {
        this.logger.error(
          `Fail to create user meeting due to user ID ${userId} already exist`,
        );
        throw new BadRequestException('User already in meeting');
      }
      const userMeeting = await this.repo.create({
        userId,
        meetingId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUserId,
        updatedBy: currentUserId,
        attendStatus: '0', //Waiting for acceptance
      });
      const user = await this.userService.findOneById(userId);
      const meeting = await this.meetingService.findOne(meetingId);
      const formattedDatetime = format(meeting.startTime, 'yyyy-MM-dd HH:mm');
      const separatedDateAndTime = formattedDatetime.split(' ');
      const acceptUrl = `http://localhost:8000/usermeetings/changeStatus?userId=${userId}&meetingId=${meetingId}&status=accepted`;
      const rejectUrl = `http://localhost:8000/usermeetings/changeStatus?userId=${userId}&meetingId=${meetingId}&status=rejected`;
      if (user) {
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
            rejectUrl,
          },
        });
      }

      this.logger.log(
        `Successfully create new user meeting with user ID ${userId} and meeting ID ${meetingId}`,
      );
      return this.repo.save(userMeeting);
    } catch (error) {
      this.logger.error(
        `Error when creating new user meeting with user ID ${userId} and meeting ID ${meetingId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(error);
    }
  }

  async remove(userId: string, meetingId: string) {
    try {
      let userMeeting = await this.repo.findOne({
        where: {
          userId,
          meetingId,
        },
      });
      if (!userMeeting) {
        this.logger.error(
          `Fail when remove user meeting due to user ID ${userId} not involved in meeting ID ${meetingId}`,
        );
        throw new BadRequestException('User not in meeting');
      }

      this.logger.log(
        `Successfully remove user meeting with user ID ${userId} and meeting ID ${meetingId}`,
      );
      return this.repo.remove(userMeeting);
    } catch (error) {
      this.logger.error(
        `Error when removing user meeting with user ID ${userId} and meeting ID ${meetingId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Internal server error');
    }
  }
}
