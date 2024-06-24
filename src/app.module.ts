import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/orm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MeetingsModule } from './meetings/meetings.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsermeetingsModule } from './usermeetings/usermeetings.module';
import { FilesModule } from './files/files.module';
import { MeetingminutesModule } from './meetingminutes/meetingminutes.module';
import { LoggerModule } from './logger/logger.module';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { mailerconfig } from './configs/mailer.config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS')
          }
        },
        defaults: {
          from: `"CLV Meeting" <${configService.get('MAIL_FROM')}>`
        },
        template: {
          dir: join(__dirname, 'templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
    }),
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
export class AppModule { }
