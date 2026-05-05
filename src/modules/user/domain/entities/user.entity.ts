/**
 * Domain entity — no framework imports.
 * `password` holds the stored credential (hash), never plaintext.
 */
export class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
  ) {}

  static create(id: string, email: string, passwordHash: string): User {
    return new User(id, email, passwordHash);
  }
}
