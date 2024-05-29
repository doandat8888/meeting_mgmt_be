import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';

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

    async create(email: string, passwordHash: string, full_name: string): Promise<User | undefined> {
        try {
            let date = new Date();
            const user = await this.repo.create({ 
                email, 
                password: passwordHash, 
                full_name, 
                role: 'employee', 
                created_at: date
            });
            // return the user
            return this.repo.save(user);
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal error");
        }
    }

    async updateUser(user: Partial<UpdateUserDto>, email: string): Promise<User | undefined> {
        const userExist = await this.repo.findOne({ where: {email} });
        if(!userExist) {
            throw new BadRequestException('User not found');
        }
        try {
            Object.keys(user).forEach(key => {
                if (userExist[key] !== undefined && 
                    key !== 'email' && 
                    key !== 'password' && 
                    key !== 'id' && 
                    key !== 'created_at' &&
                    key !== 'role'
                ) {
                    userExist[key] = user[key];
                }
            })
            return this.repo.save(userExist);
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Internal error");
        }
    }
}
