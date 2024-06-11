import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { role } from "src/users/enums/role.enum";

@Injectable()

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if(!request.user) return false;
        const user = request.user;
        return user.role === role.admin;
    }
}