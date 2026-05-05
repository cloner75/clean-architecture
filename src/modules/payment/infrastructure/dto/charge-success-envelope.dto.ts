import { ApiProperty } from '@nestjs/swagger';
import { ChargeResponseDto } from './charge-response.dto';

export class ChargeSuccessEnvelopeDto {
  @ApiProperty({ enum: [true], example: true })
  success!: true;

  @ApiProperty({ type: ChargeResponseDto })
  data!: ChargeResponseDto;
}
