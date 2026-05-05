import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ChargeUserUseCase } from '../../application/charge-user.use-case';
import { HttpExceptionBodyDto } from '../../../../shared/swagger/http-exception-body.dto';
import { ChargeResponseDto } from '../dto/charge-response.dto';
import { ChargeDto } from '../dto/charge.dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly chargeUser: ChargeUserUseCase) {}

  @Post('charge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Charge a user via the configured payment gateway' })
  @ApiOkResponse({
    description: 'Charge attempted; returns payment id and status.',
    type: ChargeResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No user exists for the given user id.',
    type: HttpExceptionBodyDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (amount, currency code, etc.).',
    type: HttpExceptionBodyDto,
  })
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
