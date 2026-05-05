import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    format: 'email',
    example: 'newuser@example.com',
    description: 'Email address for the new account.',
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
