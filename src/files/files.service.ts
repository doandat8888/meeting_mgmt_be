import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';
import { UpdateFileDto } from './dtos/update-file.dto';
import { UsersService } from 'src/users/users.service';
import { CustomLoggerService } from 'src/logger/logger.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private repo: Repository<File>,
    private userService: UsersService,
    private readonly logger: CustomLoggerService,
  ) {}

  async getFiles(meetingId: string): Promise<any> {
    this.logger.log(`Fetching files for meeting ${meetingId}`);
    const files = await this.repo.find({ where: { meetingId } });

    const filesWithUsers = await Promise.all(
      files.map(async (file) => {
        const user = await this.userService.findOneById(file.createdBy);
        return user
          ? {
              ...file,
              userCreateName: user.fullName,
            }
          : file;
      }),
    );

    return filesWithUsers;
  }

  async delete(fileId: string) {
    this.logger.log(`Deleting file ${fileId}`);
    const file = await this.repo.findOne({ where: { id: fileId } });
    return this.repo.remove(file);
  }

  async create(
    name: string,
    type: string,
    link: string,
    publicId: string,
    meetingId: string,
    idUser: string,
  ): Promise<File> {
    this.logger.log(
      `User ${idUser} starting create file named ${name} of type ${type} with public id ${publicId} in meeting ${meetingId}`,
    );

    try {
      let file = await this.repo.create({
        name,
        type,
        link,
        publicId,
        meetingId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: idUser,
        updatedBy: idUser,
      });

      return this.repo.save(file);
    } catch (error) {
      this.logger.error(
        `Error when user ${idUser} creating file with public id ${publicId} in meeting ${meetingId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Internal server error');
    }
  }

  async update(
    file: File,
    @Body() updateFileDto: UpdateFileDto,
    userId: string,
  ) {
    this.logger.log(`User ${userId} is updating file ${file?.id}`);

    try {
      Object.keys(updateFileDto).forEach((key) => {
        if (
          file[key] !== undefined &&
          key !== 'id' &&
          key !== 'createdAt' &&
          key !== 'updatedAt'
        ) {
          file[key] = updateFileDto[key];
        }
      });

      file['updatedBy'] = userId;

      return await this.repo.save(file);
    } catch (error) {
      this.logger.error(
        `Error when user ${userId} updating file: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Internal server error');
    }
  }

  async findOne(fileId: string): Promise<File> {
    this.logger.log(`Fetching file with ID: ${fileId}`);
    return this.repo.findOne({ where: { id: fileId } });
  }
}
