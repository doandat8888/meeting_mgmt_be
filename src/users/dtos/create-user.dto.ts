import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(50)
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string

    @IsString()
    @IsNotEmpty()
    fullName: string

}