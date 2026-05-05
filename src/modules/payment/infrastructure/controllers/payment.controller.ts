import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ChargeUserUseCase } from '../../application/charge-user.use-case';
import { ApiErrorEnvelopeSwaggerDto } from '../../../../shared/http/api-envelope.swagger.dto';
import { ChargeSuccessEnvelopeDto } from '../dto/charge-success-envelope.dto';
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
    type: ChargeSuccessEnvelopeDto,
  })
  @ApiNotFoundResponse({
    description: 'No user exists for the given user id.',
    type: ApiErrorEnvelopeSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (amount, currency code, etc.).',
    type: ApiErrorEnvelopeSwaggerDto,
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
        throw new HttpException(
          {
            message: 'User not found',
            code: 'USER_NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw err;
    }
  }
}
