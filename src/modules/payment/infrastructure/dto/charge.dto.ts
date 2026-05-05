import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, Length, Min } from 'class-validator';

export class ChargeDto {
  @ApiProperty({
    minLength: 1,
    maxLength: 64,
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User id to debit (must exist).',
  })
  @IsString()
  @Length(1, 64)
  userId!: string;

  @ApiProperty({
    minimum: 0.01,
    example: 49.99,
    description: 'Charge amount in major currency units.',
  })
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount!: number;

  @ApiProperty({
    minLength: 3,
    maxLength: 3,
    example: 'USD',
    description: 'ISO 4217 alphabetic code (stored/processed uppercase).',
  })
  @IsString()
  @Length(3, 3)
  currency!: string;
}
