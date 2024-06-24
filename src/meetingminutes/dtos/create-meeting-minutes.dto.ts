import { IsNotEmpty } from "class-validator";

export class CreateMeetingMinutesDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    link: string;

    @IsNotEmpty()
    publicId: string;

    @IsNotEmpty()
    meetingId: string;
}