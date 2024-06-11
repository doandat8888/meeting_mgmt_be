import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { role } from './enums/role.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
    ) { }

    async findAll() {
        return this.repo.find();
    }

    async findOne(email: string): Promise<User> {
        return this.repo.findOne({ where: { email } });
    }

    async findOneById(id: string): Promise<User> {
        return this.repo.findOne({ where: { id } });
    }

    async findOneDeleted(userId: string): Promise<User> {
        return await this.repo.findOne({ where: { id: userId }, withDeleted: true});
    }

    async create(email: string, passwordHash: string, fullName: string): Promise<User | undefined> {
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
            // return the user
            return this.repo.save(user);
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
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
            throw new BadRequestException('User not found');
        }
        return searchResult;
    }

    async findUsersgByParams(searchParams: string[], users: User[]): Promise<User[]> {
        return users.filter(user => {
            for (const key in searchParams) {
                if (searchParams[key]) {
                    if (user[key].toLowerCase().indexOf(searchParams[key].toLowerCase()) === -1) {
                        return false;
                    }
                }
            }
            return true;
        });
    }
    
    async updateUser(user: Partial<UpdateUserDto>, email: string): Promise<User | undefined> {
        const userExist = await this.repo.findOne({ where: { email } });
        if(!userExist) {
            throw new BadRequestException('User not found');
        }
        try {
            Object.keys(user).forEach(key => {
                if (userExist[key] !== undefined && 
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
            })
            return this.repo.save(userExist);
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal server error");
        }
    }

    async softDelete(user: User) {
        return this.repo.softRemove(user);
    }

    async recover(user: User) {
        return this.repo.recover(user);
    }
}
