import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    Query,
} from '@nestjs/common';
import {
    CreateMeetingAndAttendeeDto,
    CreateMeetingDto,
} from './dtos/create-meeting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from './meeting.entity';
import { Repository } from 'typeorm';
import { UpdateMeetingDto } from './dtos/update.meeting.dto';
import * as moment from 'moment-timezone';
import { UsersService } from 'src/users/users.service';
import { UsermeetingsService } from 'src/usermeetings/usermeetings.service';

@Injectable()
export class MeetingsService {
    constructor(
        @InjectRepository(Meeting) private repo: Repository<Meeting>,
        private userService: UsersService,
        @Inject(forwardRef(() => UsermeetingsService))
        private userMeetingService: UsermeetingsService,
    ) { }

    async findAll(): Promise<Meeting[]> {
        return await this.repo.find();
    }

    async findOne(meetingId: string): Promise<Meeting> {
        return await this.repo.findOne({ where: { id: meetingId } });
    }

    async findByUserId(userId: string): Promise<Meeting[]> {
        return await this.repo.find({ where: { createdBy: userId } });
    }

    async findOneDeleted(meetingId: string): Promise<Meeting> {
        return await this.repo.findOne({
            where: { id: meetingId },
            withDeleted: true,
        });
    }

    async create(
        createMeetingAndAttendeeDto: CreateMeetingAndAttendeeDto,
        userId: string,
    ) {
        await this.checkDuplicateMeetingCreate(createMeetingAndAttendeeDto);
        try {
            const meeting = this.repo.create({
                title: createMeetingAndAttendeeDto.title,
                tag: createMeetingAndAttendeeDto.tag,
                description: createMeetingAndAttendeeDto.description,
                note: createMeetingAndAttendeeDto.note,
                startTime: createMeetingAndAttendeeDto.startTime,
                endTime: createMeetingAndAttendeeDto.endTime,
                location: createMeetingAndAttendeeDto.location,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: userId,
                updatedBy: userId,
            });

            const currentMeeting = await this.repo.save(meeting);
            const attendees = createMeetingAndAttendeeDto.attendees;
            const attendeePromises = attendees.map(async (email) => {
                const result = await this.userService.findOne(email);
                return result.id;
            });

            // Add the attendee
            let attendeeIds = [];
            if (attendees) {
                attendeeIds = await Promise.all(attendeePromises);

                attendeeIds.forEach(async (id) => {
                    await this.userMeetingService.create(
                        id,
                        currentMeeting.id,
                        currentMeeting.createdBy,
                    );
                });
            }

            return { ...currentMeeting, attendees: attendeeIds };
        } catch (error) {
            console.log(error);
            throw new BadRequestException('Internal server error');
        }
    }

    async update(
        meeting: Meeting,
        updateMeetingDto: UpdateMeetingDto,
        userId: string,
    ) {
        try {
            const { location, startTime, endTime } = updateMeetingDto;

            // Case 1: Keep location, change startTime or endTime
            if ((startTime || endTime) && !location) {
                await this.checkDuplicateMeetingUpdate(meeting.id, {
                    location: meeting.location,
                    startTime: startTime || meeting.startTime,
                    endTime: endTime || meeting.endTime,
                });
            }

            // Case 2: Change location, keep startTime and endTime
            if (location && !startTime && !endTime) {
                await this.checkDuplicateMeetingUpdate(meeting.id, {
                    location: location,
                    startTime: meeting.startTime,
                    endTime: meeting.endTime,
                });
            }

            // Case 3: Change location and change startTime or endTime
            if (location && (startTime || endTime)) {
                await this.checkDuplicateMeetingUpdate(meeting.id, {
                    location: location,
                    startTime: startTime || meeting.startTime,
                    endTime: endTime || meeting.endTime,
                });
            }

            // Update meeting with new values from updateMeetingDto
            Object.keys(updateMeetingDto).forEach((key) => {
                if (
                    meeting[key] !== undefined &&
                    key !== 'id' &&
                    key !== 'createdAt' &&
                    key !== 'updatedAt'
                ) {
                    meeting[key] = updateMeetingDto[key];
                }
            });

            meeting['updatedBy'] = userId;
            return await this.repo.save(meeting);
        } catch (error) {
            throw new BadRequestException(error.response.message);
        }
    }

    async checkDuplicateMeetingCreate(
        meetingDto: CreateMeetingDto | UpdateMeetingDto,
    ) {
        const existMeetings = await this.repo.find({
            where: {
                location: meetingDto.location,
            },
        });
        if (!existMeetings) return;
        for (const existMeeting of existMeetings) {
            // Convert time to UTC
            const meetingStartTimeUTC = moment(meetingDto.startTime).utc();
            const meetingEndTimeUTC = moment(meetingDto.endTime).utc();
            const existMeetingStartTimeUTC = moment(existMeeting.startTime).utc();
            const existMeetingEndTimeUTC = moment(existMeeting.endTime).utc();

            const isOverlapping =
                (meetingStartTimeUTC.isBefore(existMeetingEndTimeUTC) &&
                    meetingEndTimeUTC.isAfter(existMeetingStartTimeUTC)) ||
                (meetingStartTimeUTC.isSameOrAfter(existMeetingStartTimeUTC) &&
                    meetingStartTimeUTC.isBefore(existMeetingEndTimeUTC)) ||
                (meetingEndTimeUTC.isAfter(existMeetingStartTimeUTC) &&
                    meetingEndTimeUTC.isSameOrBefore(existMeetingEndTimeUTC)) ||
                (meetingStartTimeUTC.isSameOrBefore(existMeetingStartTimeUTC) &&
                    meetingEndTimeUTC.isSameOrAfter(existMeetingEndTimeUTC));

            if (isOverlapping) {
                throw new BadRequestException(
                    'This time has been booked for another meeting.',
                );
            }
        }
    }

    async checkDuplicateMeetingUpdate(
        meetingId: string,
        meetingDto: CreateMeetingDto | UpdateMeetingDto,
    ) {
        const existMeetings = await this.repo.find({
            where: {
                location: meetingDto.location,
            },
        });
        if (!existMeetings) return;
        for (const existMeeting of existMeetings) {
            if (existMeeting.id !== meetingId) {
                // Convert time to UTC
                const meetingStartTimeUTC = moment(meetingDto.startTime).utc();
                const meetingEndTimeUTC = moment(meetingDto.endTime).utc();
                const existMeetingStartTimeUTC = moment(existMeeting.startTime).utc();
                const existMeetingEndTimeUTC = moment(existMeeting.endTime).utc();

                const isOverlapping =
                    (meetingStartTimeUTC.isBefore(existMeetingEndTimeUTC) &&
                        meetingEndTimeUTC.isAfter(existMeetingStartTimeUTC)) ||
                    (meetingStartTimeUTC.isSameOrAfter(existMeetingStartTimeUTC) &&
                        meetingStartTimeUTC.isBefore(existMeetingEndTimeUTC)) ||
                    (meetingEndTimeUTC.isAfter(existMeetingStartTimeUTC) &&
                        meetingEndTimeUTC.isSameOrBefore(existMeetingEndTimeUTC)) ||
                    (meetingStartTimeUTC.isSameOrBefore(existMeetingStartTimeUTC) &&
                        meetingEndTimeUTC.isSameOrAfter(existMeetingEndTimeUTC));

                if (isOverlapping) {
                    throw new BadRequestException(
                        'This time has been booked for another meeting.',
                    );
                }
            }
        }
    }

    async softDelete(meeting: Meeting) {
        return this.repo.softRemove(meeting);
    }

    async recover(meeting: Meeting) {
        return this.repo.recover(meeting);
    }

    async search(@Query() searchParams: string[]) {
        const meetings = await this.findAll();
        for (const key in searchParams) {
            // Check if user has key
            if (!meetings[0][key]) {
                throw new BadRequestException('This property is not exist');
            }
        }
        const searchResult = await this.findMeetingByParams(searchParams, meetings);
        if (searchResult.length === 0) {
            throw new BadRequestException('Meeting not found');
        }
        return searchResult;
    }

    async findMeetingByParams(
        searchParams: string[],
        meetings: Meeting[],
    ): Promise<Meeting[]> {
        return meetings.filter((meeting) => {
            for (const key in searchParams) {
                if (searchParams[key]) {
                    if (
                        meeting[key]
                            .toLowerCase()
                            .indexOf(searchParams[key].toLowerCase()) === -1
                    ) {
                        return false;
                    }
                }
            }
            return true;
        });
    }
}
