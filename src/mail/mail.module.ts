import { MailerModule } from '@nest-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailConsumer } from 'src/usermeetings/consumers/email.consumer';
import { MailService } from './mail.service';
import { mailerconfig } from 'src/configs/mailer.config';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'send-mail',
        }),
        MailerModule.forRootAsync(mailerconfig),
    ],
    providers: [MailService, EmailConsumer],
    exports: [MailService],
})
export class MailModule {}
