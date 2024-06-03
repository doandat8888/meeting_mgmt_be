import { Expose } from "class-transformer";

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