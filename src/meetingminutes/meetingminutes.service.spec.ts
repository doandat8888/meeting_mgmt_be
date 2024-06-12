import { Test, TestingModule } from '@nestjs/testing';
import { MeetingminutesService } from './meetingminutes.service';

describe('MeetingminutesService', () => {
  let service: MeetingminutesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingminutesService],
    }).compile();

    service = module.get<MeetingminutesService>(MeetingminutesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
