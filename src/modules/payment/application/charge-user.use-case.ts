import { randomUUID } from 'crypto';
import type { PaymentGateway } from '../domain/interfaces/payment-gateway.interface';
import { Payment } from '../domain/entities/payment.entity';
import type { UserRepository } from '../../user/domain/interfaces/user-repository.interface';

export class ChargeUserUseCase {
  constructor(
    private readonly paymentGateway: PaymentGateway,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: {
    userId: string;
    amount: number;
    currency: string;
  }): Promise<{
    paymentId: string;
    status: string;
    externalId?: string;
  }> {
    const user = await this.userRepository.findById(input.userId);
    if (user === null) {
      throw new Error('USER_NOT_FOUND');
    }
    const payment = Payment.createPending(
      randomUUID(),
      input.userId,
      input.amount,
      input.currency,
    );
    const result = await this.paymentGateway.charge(payment);
    const finalStatus = result.status === 'completed' ? 'completed' : 'failed';
    return {
      paymentId: payment.id,
      status: finalStatus,
      externalId: result.externalId,
    };
  }
}
