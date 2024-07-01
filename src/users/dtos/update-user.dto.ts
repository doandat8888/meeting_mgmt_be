import { IsDate, IsEnum, IsString, MaxLength, MinLength } from "class-validator"
import { gender } from "../enums/gender.enum"

export class UpdateUserDto {

    @IsString()
    @MaxLength(50)
    @MinLength(5)
    full_name: string

    @IsString()
    @MinLength(10)
    @MaxLength(15)
    phone_number: string

    @IsString()
    @MinLength(5)
    @MaxLength(255)
    address: string

    @IsString()
    avatar: string

    @IsString()
    phoneNumber: string;

    @IsDate()
    dateOfBirth: Date;

    @IsEnum(gender, {
        message: 'Gender must be one of: male, female, other'
    })
    gender: gender;

    @IsString()
    provider: string;

}