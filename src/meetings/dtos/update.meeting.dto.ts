import { CreateMeetingDto } from "./create-meeting.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMeetingDto extends PartialType(CreateMeetingDto) {}