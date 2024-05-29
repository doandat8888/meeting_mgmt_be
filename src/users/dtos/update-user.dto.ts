import { IsString } from "class-validator"

export class UpdateUserDto {

    @IsString()
    full_name: string

    @IsString()
    phone_number: string

    @IsString()
    address: string

    @IsString()
    avatar: string
}