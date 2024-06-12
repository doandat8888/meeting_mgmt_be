import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingMinutes } from './meeting-minutes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MeetingMinutesService {

    constructor(
        @InjectRepository(MeetingMinutes) private repo: Repository<MeetingMinutes>
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

    async findLatest(meetingId: string): Promise<MeetingMinutes>{
        try {
            let meetingMinutes = await this.repo.find({ where: { meetingId } });
            return meetingMinutes[meetingMinutes.length - 1];
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
    }

    async findAll(): Promise<MeetingMinutes[]>{
        return this.repo.find();
    }
}
