import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator"
import { meetingType } from "../enums/meeting.enum"

export class CreateMeetingDto {

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    type: meetingType

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    note: string

    @IsNotEmpty()
    startTime: Date

    @IsNotEmpty()
    endTime: Date

    @IsString()
    @IsNotEmpty()
    location: string
}