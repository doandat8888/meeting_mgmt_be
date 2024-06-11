import { Module } from '@nestjs/common';
import { MeetingminutesController } from './meetingminutes.controller';
import { MeetingMinutesService } from './meetingminutes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingMinutes } from './meeting-minutes.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/configs/jwt.config';
import { UsersModule } from 'src/users/users.module';
import { MeetingsModule } from 'src/meetings/meetings.module';
import { UsermeetingsModule } from 'src/usermeetings/usermeetings.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([MeetingMinutes]),
        JwtModule.registerAsync(jwtConfig),
        UsersModule,
        MeetingsModule,
        UsermeetingsModule
    ],
    controllers: [MeetingminutesController],
    providers: [MeetingMinutesService]
})
export class MeetingminutesModule { }
