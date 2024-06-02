import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('cloudinary')
export class CloudinaryController {

    constructor(
        private readonly cloudinaryService: CloudinaryService
    ) {}
    @Get('/')
    getHello(): string {
        return 'Hello Cloudinary';
    }

    @Post('/upload')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.cloudinaryService.uploadFile(file);
    }
}
