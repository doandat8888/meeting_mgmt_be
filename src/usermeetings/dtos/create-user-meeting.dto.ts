import { IsNotEmpty } from "class-validator";

export class CreateUserMeetingDto {
    @IsNotEmpty()
    meetingId: string;

    @IsNotEmpty()
    userId: string;
}