import { Expose } from "class-transformer";

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    fullName: string;

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
}