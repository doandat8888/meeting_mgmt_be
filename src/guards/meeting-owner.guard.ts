import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CustomLoggerService } from 'src/logger/logger.service';
import { MeetingsService } from 'src/meetings/meetings.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MeetingOwnerGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private meetingService: MeetingsService,
    private readonly logger: CustomLoggerService,
  ) {}
  // Only admin and people who attend are allowed to see attendees
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      this.logger.warn('MeetingOwnerGuard: No user found in request');
      return false;
    }

    const currentUser = request.user;
    const user = await this.userService.findOne(currentUser.email);
    if (!user) {
      this.logger.warn(
        `MeetingOwnerGuard: User ${currentUser.email} not found`,
      );
      return false;
    }

    const meetingId = request.body.meetingId;
    const meeting = await this.meetingService.findOne(meetingId);
    const isOwner = user.id === meeting.createdBy;
    if (isOwner) {
      this.logger.log(
        `MeetingOwnerGuard: User ${user.email} is the owner of meeting ${meetingId}`,
      );
    } else {
      this.logger.warn(
        `MeetingOwnerGuard: User ${user.email} is not the owner of meeting ${meetingId}`,
      );
    }
    return isOwner;
  }
}
