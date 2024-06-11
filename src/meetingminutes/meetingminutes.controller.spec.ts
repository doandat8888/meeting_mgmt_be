import { Test, TestingModule } from '@nestjs/testing';
import { MeetingminutesController } from './meetingminutes.controller';

describe('MeetingminutesController', () => {
  let controller: MeetingminutesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingminutesController],
    }).compile();

    controller = module.get<MeetingminutesController>(MeetingminutesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
