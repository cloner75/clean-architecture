import { Module } from '@nestjs/common';
import type { PaymentGateway } from './domain/interfaces/payment-gateway.interface';
import type { UserRepository } from '../user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from '../user/domain/tokens/user.tokens';
import { PAYMENT_GATEWAY } from './domain/tokens/payment.tokens';
import { ChargeUserUseCase } from './application/charge-user.use-case';
import { StubPaymentGateway } from './infrastructure/gateways/stub-payment.gateway';
import { PaymentController } from './infrastructure/controllers/payment.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [PaymentController],
  providers: [
    {
      provide: PAYMENT_GATEWAY,
      useClass: StubPaymentGateway,
    },
    {
      provide: ChargeUserUseCase,
      useFactory: (gateway: PaymentGateway, users: UserRepository) =>
        new ChargeUserUseCase(gateway, users),
      inject: [PAYMENT_GATEWAY, USER_REPOSITORY],
    },
  ],
})
export class PaymentModule {}
