import type { Payment } from '../entities/payment.entity';

export interface ChargeResult {
  readonly status: 'completed' | 'failed';
  readonly externalId?: string;
}

export interface PaymentGateway {
  charge(payment: Payment): Promise<ChargeResult>;
}
