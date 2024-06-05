import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { role } from "src/users/enums/role.enum";

@Injectable()

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if(!request.currentUser) return false;
        console.log(request.currentUser);
        const user = request.currentUser;
        return user.currentUser.role === role.admin;
    }
}