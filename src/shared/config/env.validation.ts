import { IsOptional, IsString, MinLength } from 'class-validator';

/**
 * Validated environment variables (infrastructure concern — uses class-validator).
 */
export class EnvironmentVariables {
  @IsOptional()
  @IsString()
  PORT?: string;

  @IsString()
  @MinLength(16)
  JWT_SECRET!: string;

  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN?: string;
}
