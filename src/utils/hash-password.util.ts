import { BadRequestException } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { User } from "src/users/user.entity";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

export const hashPassword = async(password: string) => {
    // Hash the user password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // Join hashed result and salt together
    const result = salt + '.' + hash.toString('hex');
    // Create a new user and save it
    return result;
}

export const comparePassword = async(user: User, password: string) => {
    // Compare the user password with the stored hash
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if(storedHash !== hash.toString('hex')) return false;
    return true;
}
