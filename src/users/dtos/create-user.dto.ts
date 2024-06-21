import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator"

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string

    @IsString()
    @IsNotEmpty()
    fullName: string

}