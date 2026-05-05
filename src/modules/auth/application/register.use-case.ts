import { randomUUID } from 'crypto';
import { User } from '../../user/domain/entities/user.entity';
import type { UserRepository } from '../../user/domain/interfaces/user-repository.interface';
import type { PasswordHasher } from '../../user/domain/interfaces/password-hasher.interface';

export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: {
    email: string;
    plainPassword: string;
  }): Promise<{ userId: string }> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing !== null) {
      throw new Error('USER_EMAIL_ALREADY_EXISTS');
    }
    const passwordHash = await this.passwordHasher.hash(input.plainPassword);
    const user = User.create(randomUUID(), input.email, passwordHash);
    await this.userRepository.save(user);
    return { userId: user.id };
  }
}
