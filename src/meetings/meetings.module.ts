import { Module } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/configs/jwt.config';
import { Meeting } from './meeting.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Meeting]),
        JwtModule.registerAsync(jwtConfig),
        UsersModule
    ],
    controllers: [MeetingsController],
    providers: [MeetingsService]
})
export class MeetingsModule { }
