import { Module } from '@nestjs/common';
import type { UserRepository } from './domain/interfaces/user-repository.interface';
import type { PasswordHasher } from './domain/interfaces/password-hasher.interface';
import { USER_REPOSITORY, PASSWORD_HASHER } from './domain/tokens/user.tokens';
import { CreateUserUseCase } from './application/create-user.use-case';
import { GetUserByEmailUseCase } from './application/get-user-by-email.use-case';
import { InMemoryUserRepository } from './infrastructure/persistence/in-memory-user.repository';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher';

@Module({
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        passwordHasher: PasswordHasher,
      ) => new CreateUserUseCase(userRepository, passwordHasher),
      inject: [USER_REPOSITORY, PASSWORD_HASHER],
    },
    {
      provide: GetUserByEmailUseCase,
      useFactory: (userRepository: UserRepository) =>
        new GetUserByEmailUseCase(userRepository),
      inject: [USER_REPOSITORY],
    },
  ],
  exports: [
    USER_REPOSITORY,
    PASSWORD_HASHER,
    CreateUserUseCase,
    GetUserByEmailUseCase,
  ],
})
export class UserModule {}
