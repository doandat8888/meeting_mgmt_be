import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { role } from './enums/role.enum';
import { CustomLoggerService } from 'src/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private readonly logger: CustomLoggerService,
  ) {}

  async findAll() {
    this.logger.log('Find all user');
    return this.repo.find();
  }

  async findOne(email: string): Promise<User> {
    const res = this.repo.findOne({ where: { email } });
    if (res) {
      this.logger.log(`Successfully find user ${email} by email`);
    } else {
      this.logger.error(`User ${email} not found by email`);
    }
    return res;
  }

  async findOneById(id: string): Promise<User> {
    const res = this.repo.findOne({ where: { id } });
    if (res) {
      this.logger.log(`Successfully find user ${id} by ID`);
    } else {
      this.logger.error(`User ${id} not found by ID`);
    }
    return res;
  }

  async findOneDeleted(userId: string): Promise<User> {
    const res = await this.repo.findOne({
      where: { id: userId },
      withDeleted: true,
    });
    if (res) {
      this.logger.log(`Successfully find deleted user ${userId}`);
    } else {
      this.logger.error(`Deleted user with ${userId} not found`);
    }
    return res;
  }

  async create(
    email: string,
    passwordHash: string,
    fullName: string,
  ): Promise<User | undefined> {
    try {
      let date = new Date();
      const user = await this.repo.create({
        email,
        password: passwordHash,
        fullName,
        role: role.user,
        createdAt: date,
        updatedAt: date,
      });
      this.logger.log(`User "${fullName}" successfully created`);
      // return the user
      return this.repo.save(user);
    } catch (error) {
      this.logger.error(
        `Error when creating user "${fullName}": ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Internal server error');
    }
  }

  async search(@Query() searchParams): Promise<User[]> {
    const users = await this.findAll();
    for (const key in searchParams) {
      // Check if user has key
      if (!users[0][key]) {
        throw new BadRequestException('This property is not exist');
      }
    }
    const searchResult = await this.findUsersgByParams(searchParams, users);
    if (searchResult.length === 0) {
      this.logger.error('No user exist when searching');
      throw new BadRequestException('User not found');
    }

    this.logger.log('Successfully search user');
    return searchResult;
  }

  async findUsersgByParams(
    searchParams: string[],
    users: User[],
  ): Promise<User[]> {
    return users.filter((user) => {
      for (const key in searchParams) {
        if (searchParams[key]) {
          if (
            user[key].toLowerCase().indexOf(searchParams[key].toLowerCase()) ===
            -1
          ) {
            this.logger.error('No user exist when finding with params');
            return false;
          }
        }
      }

      this.logger.log('Successfully found user by params');
      return true;
    });
  }

  async updateUser(
    user: Partial<UpdateUserDto>,
    email: string,
  ): Promise<User | undefined> {
    const userExist = await this.repo.findOne({ where: { email } });
    if (!userExist) {
      this.logger.error(
        `Updating user with email ${email} due to user not exist`,
      );
      throw new BadRequestException('User not found');
    }
    try {
      Object.keys(user).forEach((key) => {
        if (
          userExist[key] !== undefined &&
          key !== 'email' &&
          key !== 'password' &&
          key !== 'id' &&
          key !== 'createdAt' &&
          key !== 'role'
        ) {
          let date = new Date();
          userExist.updatedAt = date;
          userExist[key] = user[key];
        }
      });

      this.logger.log(`Successfully update user with email ${email}`);
      return this.repo.save(userExist);
    } catch (error) {
      this.logger.error(
        `Error when updating user ${email}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Internal server error');
    }
  }

  async softDelete(user: User) {
    const res = this.repo.softRemove(user);
    if (res) {
      this.logger.log(`Successfully soft delete user ${user.id}`);
    } else {
      this.logger.error(`Fail when soft deleting user ${user.id}`);
    }
    return res;
  }

  async recover(user: User) {
    const res = this.repo.recover(user);
    if (res) {
      this.logger.log(`Successfully recover user ${user.id}`);
    } else {
      this.logger.error(`Fail when recovering user ${user.id}`);
    }
    return res;
  }
}
