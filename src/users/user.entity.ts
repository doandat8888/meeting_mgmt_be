import { Exclude } from "class-transformer";
import { Column, Entity, Exclusion, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

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
    @Column({ name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @Column({ name: 'updated_at'})
    updatedAt: Date;
}