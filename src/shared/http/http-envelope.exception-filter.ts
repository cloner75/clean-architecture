import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { defaultHttpErrorCode } from './default-http-error-code';

export type ApiErrorEnvelope = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

/**
 * Maps framework/domain exceptions to the shared HTTP error envelope.
 * Keeps transport concerns at the infrastructure edge (clean architecture).
 */
@Catch()
export class HttpEnvelopeExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const normalized =
        typeof payload === 'string'
          ? payload
          : (payload as Record<string, unknown>);
      const body = this.toErrorEnvelope(status, normalized);
      res.status(status).json(body);
      return;
    }

    const body: ApiErrorEnvelope = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    };
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }

  private toErrorEnvelope(
    status: number,
    payload: string | Record<string, unknown>,
  ): ApiErrorEnvelope {
    if (typeof payload === 'string') {
      return {
        success: false,
        error: {
          code: defaultHttpErrorCode(status),
          message: payload,
        },
      };
    }

    const messageRaw = payload['message'];
    const customCode =
      typeof payload['code'] === 'string' ? payload['code'] : undefined;

    if (Array.isArray(messageRaw)) {
      return {
        success: false,
        error: {
          code: customCode ?? 'VALIDATION_FAILED',
          message: 'Validation failed',
          details: messageRaw,
        },
      };
    }

    const message =
      typeof messageRaw === 'string'
        ? messageRaw
        : typeof payload['error'] === 'string'
          ? payload['error']
          : defaultHttpErrorCode(status);

    return {
      success: false,
      error: {
        code: customCode ?? defaultHttpErrorCode(status),
        message,
      },
    };
  }
}
