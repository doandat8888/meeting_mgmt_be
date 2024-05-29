import { Expose } from "class-transformer";

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    full_name: string;

    @Expose()
    provider: string;

    @Expose()
    phone_number: string;

    @Expose()
    address: string;

    @Expose()
    avatar: string;

    @Expose()
    role: string;

    @Expose()
    created_at: Date;
}