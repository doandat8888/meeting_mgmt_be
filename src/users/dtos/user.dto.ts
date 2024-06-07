import { Expose } from "class-transformer";
import { gender } from "../enums/gender.enum";

export class UserDto {
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    fullName: string;

    @Expose()
    dateOfBirth: Date;

    @Expose()
    provider: string;

    @Expose()
    phoneNumber: string;

    @Expose()
    gender: gender;

    @Expose()
    address: string;

    @Expose()
    avatar: string;

    @Expose()
    role: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    deletedAt: Date;
}