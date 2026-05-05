import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type ApiSuccessEnvelope<T> = { success: true; data: T };

/**
 * HTTP presentation adapter: wraps successful controller payloads in a stable JSON envelope.
 * Application/domain layers stay unaware of this transport shape.
 */
@Injectable()
export class SuccessEnvelopeInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessEnvelope<unknown>> {
    return next.handle().pipe(
      map((data: unknown) => ({
        success: true as const,
        data,
      })),
    );
  }
}
