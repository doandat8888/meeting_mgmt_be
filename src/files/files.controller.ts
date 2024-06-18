import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dtos/create-file.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AttendGuard } from 'src/guards/attendees.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { UpdateFileDto } from './dtos/update-file.dto';

@Controller('files')
@UseGuards(AuthGuard)
export class FilesController {
    constructor(
        private filesService: FilesService,
    ) { }
    
    @UseGuards(AttendGuard)
    @Post('/')
    createNewFile(@Body(ValidationPipe) createFileDto: CreateFileDto, @CurrentUser() currentUser: User) {
        return this.filesService.create(createFileDto.name, createFileDto.type, createFileDto.link, createFileDto.publicId, createFileDto.meetingId, currentUser.id);
    }

    @UseGuards(AttendGuard)
    @Get('/:meetingId')
    getFiles(@Param('meetingId') meetingId: string) {
        return this.filesService.getFiles(meetingId);
    }

    @Patch('/:id')
    async update(@Param('id') fileId: string, @Body() updateFileDto: UpdateFileDto, @CurrentUser() currentUser: User) {
        const file = await this.filesService.findOne(fileId);
        if(!file) {
            throw new BadRequestException('File not found');
        }
        if(file.createdBy !== currentUser.id) throw new UnauthorizedException();
        return this.filesService.update(file, updateFileDto, currentUser.id);
    }

    @Delete('/:id')
    async delete(@Param('id') fileId: string, @CurrentUser() currentUser: User) {
        const file = await this.filesService.findOne(fileId);
        if(!file) {
            throw new BadRequestException('File not found');
        }
        if(file.createdBy!== currentUser.id) throw new UnauthorizedException();
        return this.filesService.delete(fileId);
    }
}
