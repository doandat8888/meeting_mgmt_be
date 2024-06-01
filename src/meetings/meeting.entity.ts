import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at' })
    updatedAt: Date;
}