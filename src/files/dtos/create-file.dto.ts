import { IsNotEmpty } from "class-validator";

export class CreateFileDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    link: string;

    @IsNotEmpty()
    publicId: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    meetingId: string;
}