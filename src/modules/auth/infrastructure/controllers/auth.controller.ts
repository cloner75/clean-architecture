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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterUseCase } from '../../application/register.use-case';
import { LoginUseCase } from '../../application/login.use-case';
import { InvalidCredentialsError } from '../../domain/errors/auth.errors';
import { ApiErrorEnvelopeSwaggerDto } from '../../../../shared/http/api-envelope.swagger.dto';
import { LoginSuccessEnvelopeDto } from '../dto/login-success-envelope.dto';
import { RegisterSuccessEnvelopeDto } from '../dto/register-success-envelope.dto';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiCreatedResponse({
    description: 'User created.',
    type: RegisterSuccessEnvelopeDto,
  })
  @ApiConflictResponse({
    description: 'Email is already registered.',
    type: ApiErrorEnvelopeSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (invalid email, password too short, etc.).',
    type: ApiErrorEnvelopeSwaggerDto,
  })
  async register(@Body() body: RegisterDto) {
    try {
      return await this.registerUseCase.execute({
        email: body.email,
        plainPassword: body.password,
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'USER_EMAIL_ALREADY_EXISTS') {
        throw new HttpException(
          {
            message: 'Email is already registered',
            code: 'EMAIL_ALREADY_EXISTS',
          },
          HttpStatus.CONFLICT,
        );
      }
      throw err;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate and obtain a JWT access token' })
  @ApiOkResponse({
    description: 'Credentials valid; JWT issued.',
    type: LoginSuccessEnvelopeDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password.',
    type: ApiErrorEnvelopeSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
    type: ApiErrorEnvelopeSwaggerDto,
  })
  async login(@Body() body: LoginDto) {
    try {
      return await this.loginUseCase.execute({
        email: body.email,
        plainPassword: body.password,
      });
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        throw new HttpException(
          {
            message: 'Invalid credentials',
            code: 'INVALID_CREDENTIALS',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw err;
    }
  }
}
