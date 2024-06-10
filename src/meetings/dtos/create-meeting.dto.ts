import { IsNotEmpty, IsString } from "class-validator"

export class CreateMeetingDto {

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    tag: string

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