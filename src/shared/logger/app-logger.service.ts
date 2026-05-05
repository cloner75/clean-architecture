import { Injectable, Logger } from '@nestjs/common';

/**
 * Shared logging adapter so components can depend on a single injectable
 * without introducing cross-cutting “global business services”.
 */
@Injectable()
export class AppLoggerService {
  private readonly logger = new Logger('Application');

  log(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }
}
