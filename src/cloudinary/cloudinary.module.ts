import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from 'src/configs/cloudinary.config';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/configs/jwt.config';
import { BullModule } from '@nestjs/bull';
import { UploadConsumer } from 'src/files/consumers/upload.consumer';

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync(jwtConfig),
        UsersModule,
        BullModule.registerQueue({
            name: 'upload',
        }),
    ],
    controllers: [CloudinaryController],
    providers: [CloudinaryService, CloudinaryProvider, UploadConsumer]
})
export class CloudinaryModule { }
