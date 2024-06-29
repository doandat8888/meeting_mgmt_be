import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomLoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    this.logger.log(`Incoming request: ${method} ${url}`);

    const now = Date.now();
    return next.handle().pipe(
      tap(() =>
        this.logger.log(
          `Request processed: ${method} ${url} in ${Date.now() - now}ms`,
        ),
      ),
      catchError((error) => {
        this.logger.error(`Request failed: ${method} ${url}`, error.stack);
        return throwError(() => error);
      }),
    );
  }
}
