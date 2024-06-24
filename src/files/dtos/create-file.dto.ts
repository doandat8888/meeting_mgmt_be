<<<<<<< HEAD
import { IsNotEmpty, IsString, IsUrl } from "class-validator";
=======
import { IsNotEmpty } from "class-validator";
>>>>>>> a5e0c0c491e2d5ceaf96d386c0b2b2fe93ce2e1c

export class CreateFileDto {

    @IsNotEmpty()
<<<<<<< HEAD
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsUrl()    
=======
    name: string;

    @IsNotEmpty()
>>>>>>> a5e0c0c491e2d5ceaf96d386c0b2b2fe93ce2e1c
    link: string;

    @IsNotEmpty()
    publicId: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    meetingId: string;
}