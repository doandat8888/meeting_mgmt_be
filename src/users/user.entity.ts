import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'full_name'})
    fullName: string;

    @Column()
    email: string;

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
    role: string;

    @Exclude()
    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;
}