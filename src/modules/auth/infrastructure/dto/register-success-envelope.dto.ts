import { ApiProperty } from '@nestjs/swagger';
import { RegisterResponseDto } from './register-response.dto';

export class RegisterSuccessEnvelopeDto {
  @ApiProperty({ enum: [true], example: true })
  success!: true;

  @ApiProperty({ type: RegisterResponseDto })
  data!: RegisterResponseDto;
}
