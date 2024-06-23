import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CustomLoggerService } from 'src/logger/logger.service';
import { MeetingsService } from 'src/meetings/meetings.service';
import { UsermeetingsService } from 'src/usermeetings/usermeetings.service';
// import { role } from "src/users/enums/role.enum";
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AttendGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private userMeetingService: UsermeetingsService,
    private meetingService: MeetingsService,
    private readonly logger: CustomLoggerService,
  ) {}
  // Only people who attend are allowed to see attendees
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      this.logger.warn('AttendGuard: No user found in request');
      return false;
    }

    const currentUser = request.user;
    const user = await this.userService.findOne(currentUser.email);
    if (!user) {
      this.logger.warn(`AttendGuard: User ${currentUser.email} not found`);
      return false;
    }

    const meetingId = request.params.id;
    const userMeeting = await this.userMeetingService.findOne(
      user.id,
      meetingId,
    );
    const meeting = await this.meetingService.findOne(meetingId);
    const isAbleToActivate =
      userMeeting !== null || meeting.createdBy === user.id;
    if (isAbleToActivate) {
      this.logger.log(
        `AttendGuard: User ${user.email} is allowed to attend meeting ${meetingId}`,
      );
    } else {
      this.logger.warn(
        `AttendGuard: User ${user.email} is not allowed to attend meeting ${meetingId}`,
      );
    }
    return isAbleToActivate;
  }
}
