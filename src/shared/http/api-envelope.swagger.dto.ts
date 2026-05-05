import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Shared error payload inside `{ success: false, error }` (OpenAPI). */
export class ApiErrorPayloadSwaggerDto {
  @ApiProperty({
    example: 'EMAIL_ALREADY_EXISTS',
    description:
      'Stable machine-readable code. Prefer this for clients instead of parsing messages.',
  })
  code!: string;

  @ApiProperty({
    example: 'Email is already registered',
    description: 'Human-readable summary safe to display.',
  })
  message!: string;

  @ApiPropertyOptional({
    description:
      'Extra context (e.g. class-validator messages when code is VALIDATION_FAILED).',
    example: ['email must be an email'],
    type: [String],
  })
  details?: unknown;
}

export class ApiErrorEnvelopeSwaggerDto {
  @ApiProperty({ enum: [false], example: false })
  success!: false;

  @ApiProperty({ type: ApiErrorPayloadSwaggerDto })
  error!: ApiErrorPayloadSwaggerDto;
}
