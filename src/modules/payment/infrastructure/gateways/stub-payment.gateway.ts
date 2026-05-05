import { Injectable } from '@nestjs/common';
import type {
  ChargeResult,
  PaymentGateway,
} from '../../domain/interfaces/payment-gateway.interface';
import type { Payment } from '../../domain/entities/payment.entity';

/**
 * Replace with Stripe/Adyen adapter; keeps domain/application unchanged.
 */
@Injectable()
export class StubPaymentGateway implements PaymentGateway {
  charge(payment: Payment): Promise<ChargeResult> {
    if (payment.amount <= 0) {
      return Promise.resolve({ status: 'failed' });
    }
    return Promise.resolve({
      status: 'completed',
      externalId: `stub_${payment.id}`,
    });
  }
}
