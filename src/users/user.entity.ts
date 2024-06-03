import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { gender } from "./enums/gender.enum";
import { role } from "./enums/role.enum";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
    id: string;

    @Column({ name: 'full_name' })
    fullName: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    gender: gender;

    @Column({ name: 'date_of_birth', nullable: true })
    dateOfBirth: Date;

    @Exclude()
    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    provider: string;

    @Column({ nullable: true, name: 'phone_number' })
    phoneNumber: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    role: role;

    @Exclude()
    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @Exclude()
    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date;
}