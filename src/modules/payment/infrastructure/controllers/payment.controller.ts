import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { ChargeUserUseCase } from '../../application/charge-user.use-case';
import { ChargeDto } from '../dto/charge.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly chargeUser: ChargeUserUseCase) {}

  @Post('charge')
  @HttpCode(HttpStatus.OK)
  async charge(@Body() body: ChargeDto) {
    try {
      return await this.chargeUser.execute({
        userId: body.userId,
        amount: body.amount,
        currency: body.currency.toUpperCase(),
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'USER_NOT_FOUND') {
        throw new NotFoundException('User not found');
      }
      throw err;
    }
  }
}
