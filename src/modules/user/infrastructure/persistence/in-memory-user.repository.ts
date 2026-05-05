import { Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/interfaces/user-repository.interface';
import type { User } from '../../domain/entities/user.entity';

/**
 * In-memory repository for local development and tests; swap for a TypeORM/Prisma adapter without touching domain/application.
 */
@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly byEmail = new Map<string, User>();
  private readonly byId = new Map<string, User>();

  save(user: User): Promise<void> {
    this.byEmail.set(user.email.toLowerCase(), user);
    this.byId.set(user.id, user);
    return Promise.resolve();
  }

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(this.byEmail.get(email.toLowerCase()) ?? null);
  }

  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.byId.get(id) ?? null);
  }
}
