import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('meetingminutes')
export class MeetingMinutes {
    @PrimaryGeneratedColumn('uuid', { name: 'meeting_minutes_id' })
    id: string;

    @Column()
    name: string;

    @Column()
    link: string;

    @Column({ name: 'public_id' })
    publicId: string;

    @Column({ name: 'meeting_id' })
    meetingId: string;

    @Column({ name:'created_by' })
    createdBy: string;

    @Column({ name:'updated_by' })
    updatedBy: string;

    @Exclude()
    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;
}