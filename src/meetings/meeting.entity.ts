import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { meetingType } from "./enums/meeting.enum";

@Entity('meetings')
export class Meeting {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    type: meetingType;

    @Column()
    description: string;

    @Column()
    note: string;

    @Column({ name: 'start_time'})
    startTime: Date;

    @Column({ name: 'end_time' })
    endTime: Date;

    @Column()
    location: string;

    @Column({ name: 'created_by' })
    createdBy: string;

    @Column({ name: 'updated_by' })
    updatedBy: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date;
}