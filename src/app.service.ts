import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from './logger/logger.service';

@Injectable()
export class AppService {
  // getHello(): string {
  //     return 'Hello World 1212!';
  // }

  constructor(private readonly logger: CustomLoggerService) {}

  getHello(): string {
    this.logger.log('Hello method called');
    this.logger.error('An error occurred');
    this.logger.warn('This is a warning');
    return 'Hello World!';
  }
}
