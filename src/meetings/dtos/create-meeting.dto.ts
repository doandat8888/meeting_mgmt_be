import { IsNotEmpty, IsString } from "class-validator"

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
    startTime: Date

    @IsNotEmpty()
    endTime: Date

    @IsString()
    location: string
}

export class CreateMeetingAndAttendeeDto extends CreateMeetingDto {
    attendees: string[]
}