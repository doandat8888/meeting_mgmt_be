import { Module, forwardRef } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/configs/jwt.config';
import { Meeting } from './meeting.entity';
import { UsersModule } from 'src/users/users.module';
import { UsermeetingsModule } from 'src/usermeetings/usermeetings.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Meeting]),
        JwtModule.registerAsync(jwtConfig),
        forwardRef(() => UsermeetingsModule),
        UsersModule,
    ],
    controllers: [MeetingsController],
    providers: [MeetingsService],
    exports: [MeetingsService]
})
export class MeetingsModule { }
