import { Test, TestingModule } from '@nestjs/testing';
import { UsermeetingsController } from './usermeetings.controller';

describe('UsermeetingsController', () => {
  let controller: UsermeetingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsermeetingsController],
    }).compile();

    controller = module.get<UsermeetingsController>(UsermeetingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
