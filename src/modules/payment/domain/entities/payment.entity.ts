export type PaymentStatus = 'pending' | 'completed' | 'failed';

export class Payment {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly status: PaymentStatus,
  ) {}

  static createPending(
    id: string,
    userId: string,
    amount: number,
    currency: string,
  ): Payment {
    return new Payment(id, userId, amount, currency, 'pending');
  }

  withStatus(status: PaymentStatus): Payment {
    return new Payment(
      this.id,
      this.userId,
      this.amount,
      this.currency,
      status,
    );
  }
}
