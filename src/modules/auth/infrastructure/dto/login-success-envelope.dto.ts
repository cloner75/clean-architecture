import { ApiProperty } from '@nestjs/swagger';
import { LoginResponseDto } from './login-response.dto';

export class LoginSuccessEnvelopeDto {
  @ApiProperty({ enum: [true], example: true })
  success!: true;

  @ApiProperty({ type: LoginResponseDto })
  data!: LoginResponseDto;
}
