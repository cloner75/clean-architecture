import { randomUUID } from 'crypto';
import type { UserRepository } from '../domain/interfaces/user-repository.interface';
import type { PasswordHasher } from '../domain/interfaces/password-hasher.interface';
import { User } from '../domain/entities/user.entity';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: {
    email: string;
    plainPassword: string;
  }): Promise<{ id: string; email: string }> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing !== null) {
      throw new Error('USER_EMAIL_ALREADY_EXISTS');
    }
    const passwordHash = await this.passwordHasher.hash(input.plainPassword);
    const user = User.create(randomUUID(), input.email, passwordHash);
    await this.userRepository.save(user);
    return { id: user.id, email: user.email };
  }
}
