import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ConflictException,
  UnauthorizedException,
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
import { HttpExceptionBodyDto } from '../../../../shared/swagger/http-exception-body.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';
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
    description: 'User created; returns the new user id.',
    type: RegisterResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email is already registered.',
    type: HttpExceptionBodyDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (invalid email, password too short, etc.).',
    type: HttpExceptionBodyDto,
  })
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
  @ApiOperation({ summary: 'Authenticate and obtain a JWT access token' })
  @ApiOkResponse({
    description: 'Credentials valid; JWT issued.',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password.',
    type: HttpExceptionBodyDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
    type: HttpExceptionBodyDto,
  })
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
