import { Meeting } from "src/meetings/meeting.entity";
import { User } from "src/users/user.entity";

export class CreateMailDto {
    recipient: User;
}

export class CreateMailMeetingDto extends CreateMailDto {
    meeting: Meeting;
    date: string;
    time: string;
    acceptUrl: string;
    rejectUrl: string;
}