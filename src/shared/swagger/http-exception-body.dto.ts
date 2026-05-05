import { ApiProperty } from '@nestjs/swagger';

/** Shape of NestJS `HttpException` JSON responses (used in OpenAPI examples). */
export class HttpExceptionBodyDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({
    description:
      'Error message or validation messages (Nest may return a string or string[]).',
    example: 'Email is already registered',
  })
  message!: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error!: string;
}
