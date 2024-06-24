import { File } from "src/files/file.entity";
import { MeetingMinutes } from "src/meetingminutes/meeting-minutes.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('meetings')
export class Meeting {
    @PrimaryGeneratedColumn('uuid', { name: 'meeting_id' })
    id: string;

    @Column()
    title: string;

    @Column()
    tag: string;

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

    @OneToMany(() => File, (file) => file.meeting)
    files: File[];

    @OneToMany(() => MeetingMinutes, (meetingMinute) => meetingMinute.meeting)
    meetingMinutes: MeetingMinutes[];
}