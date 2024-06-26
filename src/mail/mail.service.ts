import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateMailMeetingDto } from './dtos/create-mail.dto';
@Injectable()
export class MailService {
    constructor(
        @InjectQueue('send-mail') 
        private emailQueue: Queue
    ) { }

    async sendEmail(mailDto: CreateMailMeetingDto) {
        const { recipient, meeting, date, time, acceptUrl, rejectUrl } = mailDto;
        await this.emailQueue.add(
            'invitation',
            {
                to: recipient.email,
                name: recipient.fullName,
                meetingTitle: meeting.title,
                date,
                time,
                location: meeting.location,
                acceptUrl,
                rejectUrl,
            },
            { removeOnComplete: true },
        );
    }
}