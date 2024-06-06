import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from './meeting.entity';
import { Repository } from 'typeorm';
import { UpdateMeetingDto } from './dtos/update.meeting.dto';
import * as moment from 'moment-timezone';

@Injectable()
export class MeetingsService {

    constructor(
        @InjectRepository(Meeting) private repo: Repository<Meeting>
    ) {}

    async findAll(): Promise<Meeting[]> {
        return await this.repo.find();
    }

    async findOne(meetingId: string): Promise<Meeting> {
        return await this.repo.findOne({ where: { id: meetingId }});
    }

    async findByUserId(userId: string): Promise<Meeting[]> {
        return await this.repo.find({ where: { createdBy: userId }});
    }

    async findOneDeleted(meetingId: string): Promise<Meeting> {
        return await this.repo.findOne({ where: { id: meetingId }, withDeleted: true});
    }

    async create(createMeetingDto: CreateMeetingDto, userId: string) {
        await this.checkDuplicateMeeting(createMeetingDto);
        try {
            const meeting = await this.repo.create({
                title: createMeetingDto.title,
                type: createMeetingDto.type,
                description: createMeetingDto.description,
                note: createMeetingDto.note,
                startTime: createMeetingDto.startTime,
                endTime: createMeetingDto.endTime,
                location: createMeetingDto.location,
                createdBy: userId,
                updatedBy: userId,
            });
            return this.repo.save(meeting);
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
    }

    async update(meeting: Meeting, updateMeetingDto: UpdateMeetingDto, userId: string) {
        try {
            const { location, startTime, endTime } = updateMeetingDto;
    
            // Case 1: Keep location, change startTime or endTime
            if ((startTime || endTime) && !location) {
                await this.checkDuplicateMeeting({
                    location: meeting.location,
                    startTime: startTime || meeting.startTime,
                    endTime: endTime || meeting.endTime
                });
            }
    
            // Case 2: Change location, keep startTime and endTime
            if (location && !startTime && !endTime) {
                await this.checkDuplicateMeeting({
                    location: location,
                    startTime: meeting.startTime,
                    endTime: meeting.endTime
                });
            }
    
            // Case 3: Change location and change startTime or endTime
            if (location && (startTime || endTime)) {
                await this.checkDuplicateMeeting({
                    location: location,
                    startTime: startTime || meeting.startTime,
                    endTime: endTime || meeting.endTime
                });
            }
    
            // Update meeting with new values from updateMeetingDto
            Object.keys(updateMeetingDto).forEach(key => {
                if (meeting[key] !== undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
                    meeting[key] = updateMeetingDto[key];
                }
            });
    
            meeting['updatedBy'] = userId;
            return await this.repo.save(meeting);
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
    }
    

    async checkDuplicateMeeting(meetingDto: CreateMeetingDto | UpdateMeetingDto) {
        const existMeetings = await this.repo.find({
            where: {
                location: meetingDto.location,
            }
        });
        if(!existMeetings) return ;
        for (const existMeeting of existMeetings) {
            // Convert time to UTC
            const meetingStartTimeUTC = moment(meetingDto.startTime).utc();
            const meetingEndTimeUTC = moment(meetingDto.endTime).utc();
            const existMeetingStartTimeUTC = moment(existMeeting.startTime).utc();
            const existMeetingEndTimeUTC = moment(existMeeting.endTime).utc();
        
            const isOverlapping = 
                (meetingStartTimeUTC.isBefore(existMeetingEndTimeUTC) && meetingEndTimeUTC.isAfter(existMeetingStartTimeUTC)) ||
                (meetingStartTimeUTC.isSameOrAfter(existMeetingStartTimeUTC) && meetingStartTimeUTC.isBefore(existMeetingEndTimeUTC)) ||
                (meetingEndTimeUTC.isAfter(existMeetingStartTimeUTC) && meetingEndTimeUTC.isSameOrBefore(existMeetingEndTimeUTC)) ||
                (meetingStartTimeUTC.isSameOrBefore(existMeetingStartTimeUTC) && meetingEndTimeUTC.isSameOrAfter(existMeetingEndTimeUTC));
        
            if (isOverlapping) {
                throw new BadRequestException('This time has been booked for another meeting.');
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

    async findMeetingByParams(searchParams: string[], meetings: Meeting[]): Promise<Meeting[]> {
        return meetings.filter(meeting => {
            for (const key in searchParams) {
                if (searchParams[key]) {
                    if (meeting[key].toLowerCase().indexOf(searchParams[key].toLowerCase()) === -1) {
                        return false;
                    }
                }
            }
            return true;
        });
    }
}
