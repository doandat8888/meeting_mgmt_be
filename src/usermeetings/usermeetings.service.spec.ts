import { Test, TestingModule } from '@nestjs/testing';
import { UsermeetingsService } from './usermeetings.service';

describe('UsermeetingsService', () => {
  let service: UsermeetingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsermeetingsService],
    }).compile();

    service = module.get<UsermeetingsService>(UsermeetingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
