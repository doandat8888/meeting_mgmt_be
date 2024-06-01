import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from './meeting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MeetingsService {

    constructor(
        @InjectRepository(Meeting) private repo: Repository<Meeting>
    ) {}

    async findAll(): Promise<Meeting[]> {
        return await this.repo.find();
    }

    async create(createMeetingDto: CreateMeetingDto, userId: string) {
        const existMeeting = await this.repo.findOne({
            where: {
                location: createMeetingDto.location,
                startTime: createMeetingDto.startTime
            }
        });
        if(existMeeting) {
            throw new BadRequestException('Meeting already booked');
        }
        try {
            let date = new Date();
            const meeting = await this.repo.create({
                title: createMeetingDto.title,
                type: createMeetingDto.type,
                description: createMeetingDto.description,
                note: createMeetingDto.note,
                startTime: createMeetingDto.startTime,
                endTime: createMeetingDto.endTime,
                location: createMeetingDto.location,
                createdAt: date,
                updatedAt: date,
                createdBy: userId,
                updatedBy: userId,
            });
            return this.repo.save(meeting);
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal error");
        }
    }
}
