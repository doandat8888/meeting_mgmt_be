import { BadRequestException, Injectable, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingMinutes } from './meeting-minutes.entity';
import { Repository } from 'typeorm';
import { UsermeetingsService } from 'src/usermeetings/usermeetings.service';
import { MeetingsService } from 'src/meetings/meetings.service';
import { UsersService } from 'src/users/users.service';
import { CustomLoggerService } from 'src/logger/logger.service';

@Injectable()
export class MeetingMinutesService {
  constructor(
    @InjectRepository(MeetingMinutes) private repo: Repository<MeetingMinutes>,
    private userMeetingService: UsermeetingsService,
    private meetingService: MeetingsService,
    private userService: UsersService,
    private readonly logger: CustomLoggerService,
  ) {}

  async findAll(): Promise<MeetingMinutes[]> {
    const res = this.repo.find();
    if (res) {
      this.logger.log('Successfully fetching all meeting minutes');
    } else {
      this.logger.error('Fail when fetching all meeting minutes');
    }
    return res;
  }

  async create(
    name: string,
    link: string,
    publicId: string,
    meetingId: string,
    userId: string,
  ) {
    try {
      let meetingminutes = await this.repo.create({
        name,
        link,
        publicId,
        meetingId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        updatedBy: userId,
      });
      this.logger.log(
        `User ${userId} successfully created meeting minutes for meeting ID: ${meetingId}`,
      );
      return this.repo.save(meetingminutes);
    } catch (error: any) {
      this.logger.error(
        `Error when user ${userId} creating meeting minutes: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Internal server error');
    }
  }

  async findOne(meetingminutesId: string): Promise<MeetingMinutes> {
    try {
      let meetingminutes = await this.repo.findOne({
        where: { id: meetingminutesId },
      });
      if (!meetingminutes) {
        this.logger.error(
          `Meeting minutes with ID ${meetingminutesId} not found`,
        );
        throw new BadRequestException('Meeting minutes not found');
      }
      this.logger.log(`Meeting minutes with ID ${meetingminutesId} found`);
      return meetingminutes;
    } catch (error) {
      this.logger.error(
        `Error when fetching meeting minutes with ID ${meetingminutesId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Internal server error');
    }
  }

  async findByMeetingId(meetingId: string): Promise<MeetingMinutes[]> {
    try {
      let meetingminutes = await this.repo.find({
        where: {
          meetingId,
        },
      });
      if (!meetingminutes) {
        this.logger.error(
          `Not exist meeting minutes that belongs to meeting with ID ${meetingId}`,
        );
        throw new BadRequestException('Meeting minutes not found');
      }
      this.logger.log(
        `Successfully fetching meeting minutes for meeting with ID ${meetingId}`,
      );

      return meetingminutes;
    } catch (error) {
      this.logger.error(
        `Error when fetching meeting minutes with meeting ID ${meetingId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Internal server error');
    }
  }

  async findMeetingMinutesCurrent(userId: string) {
    try {
      let meetingsAttend =
        await this.userMeetingService.getMeetingsAttend(userId);
      if (!meetingsAttend) {
        this.logger.error(`No meeting found for user ${userId}`);
        throw new BadRequestException('Meetings not found');
      }
      let meetingMinutesList = [];
      for (let meeting of meetingsAttend) {
        let meetingMinutes = await this.repo.find({
          where: { meetingId: meeting.id },
        });
        if (meetingMinutes) {
          const meetingMinutesWithMeeting = await Promise.all(
            meetingMinutes.map(async (meetingMinute) => {
              const meeting = await this.meetingService.findOne(
                meetingMinute.meetingId,
              );
              const user = await this.userService.findOneById(
                meetingMinute.createdBy,
              );
              return meeting && user
                ? {
                    ...meetingMinute,
                    meetingTitle: meeting.title,
                    userCreateName: user.fullName,
                  }
                : meetingMinute;
            }),
          );
          meetingMinutesList.push(...meetingMinutesWithMeeting);
        }
      }
      this.logger.log(
        `Successfully fetching current meeting minutes for user with ID ${userId}`,
      );
      return meetingMinutesList;
    } catch (error) {
      this.logger.error(
        `Error fetching current meeting minutes of user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Internal server error');
    }
  }

  async findLatest(meetingId: string): Promise<MeetingMinutes> {
    try {
      let meetingMinutes = await this.repo.find({ where: { meetingId } });
      if (!meetingMinutes) {
        this.logger.error(`No meeting minutes found for meeting ${meetingId}`);
        throw new BadRequestException('Meeting minutes not found');
      }
      this.logger.log(
        `Successfully fetching latest meeting minutes for meeting with ID: ${meetingId}`,
      );
      return meetingMinutes[meetingMinutes.length - 1];
    } catch (error) {
      this.logger.error(
        `Error when fetching latest meeting minutes for meeting ${meetingId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(error.response.message);
    }
  }

  async delete(meetingMinute: MeetingMinutes) {
    const res = this.repo.remove(meetingMinute);
    if (res) {
      this.logger.log(
        `Successfully deleting meeting minutes with ID: ${meetingMinute.id}`,
      );
    } else {
      this.logger.error(
        `Fail when delete meeting minutes with ID ${meetingMinute.id}`,
      );
    }
    return res;
  }
}
