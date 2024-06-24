import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CustomLoggerService } from 'src/logger/logger.service';
import { role } from 'src/users/enums/role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly logger: CustomLoggerService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      this.logger.warn('AdminGuard: No user found in request');
      return false;
    }

    const user = request.user;
    const isAdmin = user.role === role.admin;
    if (!isAdmin) {
      this.logger.warn(`AdminGuard: User ${user.email} is not an admin`);
    } else {
      this.logger.log(`AdminGuard: User ${user.email} granted admin access`);
    }
    return isAdmin;
  }
}
