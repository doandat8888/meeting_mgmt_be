import { Injectable } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
// import { Loggly } from 'winston-loggly-bulk';

@Injectable()
export class CustomLoggerService {
  private logger;

  constructor() {
    const logTransports = [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}] ${message}`;
          }),
        ),
      }),
      new DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
      }),
      new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ];

    // Create Loggly account to use this
    // NOTE: This code make Loggly only available in production env
    // if (process.env.NODE_ENV === 'production') {
    //   logTransports.push(
    //     new Loggly({
    //       token: process.env.LOGGLY_TOKEN,
    //       subdomain: process.env.LOGGLY_SUBDOMAIN,
    //       tags: ['Winston-NodeJS'],
    //       json: true,
    //     })
    //   );
    // }

    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
      defaultMeta: { service: 'user-service' },
      transports: logTransports,
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
