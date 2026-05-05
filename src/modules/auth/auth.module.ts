import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { SignOptions } from 'jsonwebtoken';
import type { UserRepository } from '../user/domain/interfaces/user-repository.interface';
import type { PasswordHasher } from '../user/domain/interfaces/password-hasher.interface';
import {
  USER_REPOSITORY,
  PASSWORD_HASHER,
} from '../user/domain/tokens/user.tokens';
import { TOKEN_SERVICE } from './domain/tokens/auth.tokens';
import type { TokenService } from './domain/interfaces/token-service.interface';
import { RegisterUseCase } from './application/register.use-case';
import { LoginUseCase } from './application/login.use-case';
import { JwtTokenService } from './infrastructure/jwt/jwt-token.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') ??
            '1h') as SignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtTokenService,
    {
      provide: TOKEN_SERVICE,
      useExisting: JwtTokenService,
    },
    {
      provide: RegisterUseCase,
      useFactory: (users: UserRepository, hasher: PasswordHasher) =>
        new RegisterUseCase(users, hasher),
      inject: [USER_REPOSITORY, PASSWORD_HASHER],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        users: UserRepository,
        hasher: PasswordHasher,
        tokens: TokenService,
      ) => new LoginUseCase(users, hasher, tokens),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_SERVICE],
    },
  ],
})
export class AuthModule {}
