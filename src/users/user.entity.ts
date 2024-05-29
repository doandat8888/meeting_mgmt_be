import { Exclude } from "class-transformer";
import { Column, Entity, Exclusion, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    full_name: string;

    @Column()
    email: string;

    @Exclude()
    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    provider: string;

    @Column({ nullable: true})
    phone_number: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({nullable: true})
    role: string;

    @Exclude()
    @Column()
    created_at: Date;
}