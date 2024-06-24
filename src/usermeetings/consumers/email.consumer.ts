import { MailerService } from "@nest-modules/mailer";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor('send-mail')
export class EmailConsumer {
    constructor(private mailerService: MailerService) { }
    @Process('invitation')
    async sendInvitationEmail(job: Job<unknown>) {
        console.log(job.data);
        await this.mailerService.sendMail({
            to: job.data['to'],
            subject: `Invitation to meeting: ${job.data['meetingTitle']}`,
            template: 'invitation',
            context: {
                name: job.data['name'],
                meetingTitle: job.data['meetingTitle'],
                date: job.data['date'],
                time: job.data['time'],
                location: job.data['location'],
                acceptUrl: job.data['acceptUrl'],
                rejectUrl: job.data['rejectUrl'],
            },
        });
    }
}