import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('usermeetings')
export class UserMeeting {
    @PrimaryGeneratedColumn('uuid', { name: 'user_meeting_id' })
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name:'meeting_id' })
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

    @Column({ name: 'attend_status', nullable: true })
    attendStatus: string;
}