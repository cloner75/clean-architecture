import type { UserRepository } from '../../user/domain/interfaces/user-repository.interface';
import type { PasswordHasher } from '../../user/domain/interfaces/password-hasher.interface';
import type { TokenService } from '../domain/interfaces/token-service.interface';
import { InvalidCredentialsError } from '../domain/errors/auth.errors';

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: {
    email: string;
    plainPassword: string;
  }): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(input.email);
    if (user === null) {
      throw new InvalidCredentialsError();
    }
    const valid = await this.passwordHasher.verify(
      input.plainPassword,
      user.password,
    );
    if (!valid) {
      throw new InvalidCredentialsError();
    }
    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
    });
    return { accessToken };
  }
}
