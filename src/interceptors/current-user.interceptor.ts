import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { UsersService } from "src/users/users.service";


@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

    constructor(private userService: UsersService) {}

    async intercept(context: ExecutionContext, next: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const email  = request.user.email;
        if(email) {
            const user = await this.userService.findOne(email);
            request['currentUser'] = user;
        }
        return next.handle();
    }
}