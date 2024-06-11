import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { MeetingsService } from "src/meetings/meetings.service";
import { UsersService } from "src/users/users.service";

@Injectable()

export class MeetingOwnerGuard implements CanActivate {
    constructor(
        private userService: UsersService,
        private meetingService: MeetingsService
    ) {}
    // Only admin and people who attend are allowed to see attendees
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if(!request.user) return false;
        const currentUser = request.user;
        const user = await this.userService.findOne(currentUser.email);
        if(!user) return false;
        const meetingId = request.body.meetingId;
        const meeting = await this.meetingService.findOne(meetingId);
        return user.id === meeting.createdBy;
    }
}