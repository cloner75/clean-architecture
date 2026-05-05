import { Module } from '@nestjs/common';
import { AppConfigModule } from './shared/config/app-config.module';
import { AppLoggerModule } from './shared/logger/app-logger.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    UserModule,
    AuthModule,
    PaymentModule,
  ],
})
export class AppModule {}
