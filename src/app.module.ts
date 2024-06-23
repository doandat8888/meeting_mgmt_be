import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/orm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MeetingsModule } from './meetings/meetings.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsermeetingsModule } from './usermeetings/usermeetings.module';
import { FilesModule } from './files/files.module';
import { MeetingminutesModule } from './meetingminutes/meetingminutes.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    UsersModule,
    AuthModule,
    MeetingsModule,
    CloudinaryModule,
    UsermeetingsModule,
    FilesModule,
    MeetingminutesModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
