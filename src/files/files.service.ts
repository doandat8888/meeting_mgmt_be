import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';
import { UpdateFileDto } from './dtos/update-file.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FilesService {

    constructor(
        @InjectRepository(File) private repo: Repository<File>,
        private userService: UsersService
    ) {}

    async getFiles(meetingId: string): Promise<File[]> {
        // const files = await this.repo.find({ where: { meetingId } });
        // const userIds = files.map(file => file.createdBy);
        // const users = await Promise.all(userIds.map(userId => this.userService.findOneById(userId)));
        // files.forEach(file => {
        //     file.userCreateName = users.find(user => user.id === file.createdBy).fullName;
        // });
        // return files;
        return this.repo.find({ where: { meetingId } });
    }

    async delete(fileId: string) {
        const file = await this.repo.findOne({ where: { id: fileId } });
        return this.repo.remove(file);
    }

    async create(name: string, type: string, link: string, meetingId: string, idUser: string): Promise<File> {
        try {
            let file = await this.repo.create({
                name,
                type,
                link,
                meetingId,
                createdBy: idUser,
                updatedBy: idUser
            });
            return this.repo.save(file);
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
    }

    async update(file: File, @Body() updateFileDto: UpdateFileDto, userId: string) {
        try {
            Object.keys(updateFileDto).forEach(key => {
                if (file[key] !== undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
                    file[key] = updateFileDto[key];
                }
            });
    
            file['updatedBy'] = userId;
            return await this.repo.save(file);
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
    }

    async findOne(fileId: string): Promise<File> {
        return this.repo.findOne({ where: { id: fileId } });
    }
}
