import { IsDate, IsNotEmpty, IsString } from "class-validator"

export class CreateMeetingDto {

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    tag: string

    @IsString()
    description: string

    @IsString()
    note: string

    @IsNotEmpty()
    @IsDate()
    startTime: Date

    @IsDate()
    @IsNotEmpty()
    endTime: Date

    @IsString()
    location: string
}

export class CreateMeetingAndAttendeeDto extends CreateMeetingDto {
    attendees: string[]
}