import { IsDate, IsEnum, IsString } from "class-validator"
import { gender } from "../enums/gender.enum"

export class UpdateUserDto {

    @IsString()
    full_name: string

    @IsString()
    phone_number: string

    @IsString()
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