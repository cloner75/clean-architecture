import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUseCase } from '../../application/register.use-case';
import { LoginUseCase } from '../../application/login.use-case';
import { InvalidCredentialsError } from '../../domain/errors/auth.errors';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    try {
      return await this.registerUseCase.execute({
        email: body.email,
        plainPassword: body.password,
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'USER_EMAIL_ALREADY_EXISTS') {
        throw new ConflictException('Email is already registered');
      }
      throw err;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    try {
      return await this.loginUseCase.execute({
        email: body.email,
        plainPassword: body.password,
      });
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw err;
    }
  }
}
