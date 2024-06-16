import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { MeetingsService } from "src/meetings/meetings.service";
import { UsermeetingsService } from "src/usermeetings/usermeetings.service";
import { role } from "src/users/enums/role.enum";
import { UsersService } from "src/users/users.service";

@Injectable()

export class AttendGuard implements CanActivate {
    constructor(
        private userService: UsersService,
        private userMeetingService: UsermeetingsService,
        private meetingService: MeetingsService
    ) {}
    // Only people who attend are allowed to see attendees
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if(!request.user) return false;
        const currentUser = request.user;
        const user = await this.userService.findOne(currentUser.email);
        if(!user) return false;
        console.log(user);
        const meetingId = request.params.id;
        const userMeeting = await this.userMeetingService.findOne(user.id, meetingId);
        console.log(userMeeting);
        const meeting = await this.meetingService.findOne(meetingId);
        return userMeeting !== null || meeting.createdBy === user.id;
    }
}