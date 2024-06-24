import { IsNotEmpty, IsString } from "class-validator";

export class CreateMeetingMinutesDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    link: string;

    @IsNotEmpty()
    publicId: string;

    @IsNotEmpty()
    meetingId: string;
}