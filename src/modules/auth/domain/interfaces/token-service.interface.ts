export interface AccessTokenPayload {
  readonly sub: string;
  readonly email: string;
}

export interface TokenService {
  generateAccessToken(payload: AccessTokenPayload): Promise<string>;
}
