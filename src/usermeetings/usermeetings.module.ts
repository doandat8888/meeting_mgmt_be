import { Module, forwardRef } from '@nestjs/common';
import { UsermeetingsController } from './usermeetings.controller';
import { UsermeetingsService } from './usermeetings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMeeting } from './usermeeting.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/configs/jwt.config';
import { UsersModule } from 'src/users/users.module';
import { MeetingsModule } from 'src/meetings/meetings.module';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './consumers/email.consumer';
import { MailModule } from 'src/mail/mail.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserMeeting]),
        JwtModule.registerAsync(jwtConfig),
        UsersModule,
        forwardRef(() => MeetingsModule),
        MailModule
    ],
    controllers: [UsermeetingsController],
    providers: [UsermeetingsService],
    exports: [UsermeetingsService]
})
export class UsermeetingsModule { }
