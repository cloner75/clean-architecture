import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    format: 'email',
    example: 'user@example.com',
    description: 'Account email address.',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    format: 'password',
    minLength: 8,
    example: 'correcthorsebatterystaple',
    description: 'Plain-text password (minimum 8 characters).',
  })
  @MinLength(8)
  password!: string;
}
