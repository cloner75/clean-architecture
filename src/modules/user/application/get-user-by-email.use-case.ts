import type { UserRepository } from '../domain/interfaces/user-repository.interface';
import type { User } from '../domain/entities/user.entity';

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
