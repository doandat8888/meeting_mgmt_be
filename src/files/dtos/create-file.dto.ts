import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateFileDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsUrl()    
    link: string;

    @IsNotEmpty()
    publicId: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    meetingId: string;
}