import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from './meeting.entity';
import { Repository } from 'typeorm';
import { UpdateMeetingDto } from './dtos/update.meeting.dto';

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

    async update(meeting: Meeting, updateMeetingDto: UpdateMeetingDto) {
        await this.checkDuplicateMeeting(updateMeetingDto);
        try {
            Object.keys(updateMeetingDto).forEach(key => {
                if (meeting[key]!== undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
                    meeting[key] = updateMeetingDto[key];
                }
            })
            return this.repo.save(meeting);
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
            const isOverlapping = 
                (meetingDto.startTime < existMeeting.endTime && meetingDto.endTime > existMeeting.startTime) ||
                (meetingDto.startTime >= existMeeting.startTime && meetingDto.startTime < existMeeting.endTime) ||
                (meetingDto.endTime > existMeeting.startTime && meetingDto.endTime <= existMeeting.endTime) ||
                (meetingDto.startTime <= existMeeting.startTime && meetingDto.endTime >= existMeeting.endTime);
        
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
}
