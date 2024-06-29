import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomLoggerService } from './logger.service';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

@Global()
@Module({
  providers: [
    CustomLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
