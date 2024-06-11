import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/configs/jwt.config';
import { File } from './file.entity';
import { UsersModule } from 'src/users/users.module';
import { MeetingsModule } from 'src/meetings/meetings.module';
import { UsermeetingsModule } from 'src/usermeetings/usermeetings.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([File]),
        JwtModule.registerAsync(jwtConfig),
        UsersModule,
        MeetingsModule,
        UsermeetingsModule
    ],
    controllers: [FilesController],
    providers: [FilesService]
})
export class FilesModule { }
