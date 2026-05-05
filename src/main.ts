import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpEnvelopeExceptionFilter } from './shared/http/http-envelope.exception-filter';
import { SuccessEnvelopeInterceptor } from './shared/http/success-envelope.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpEnvelopeExceptionFilter());
  app.useGlobalInterceptors(new SuccessEnvelopeInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Clean Architecture API')
    .setDescription(
      'HTTP adapter: JSON bodies use a shared envelope. Success: `{ success: true, data }`. Error: `{ success: false, error: { code, message, details? } }`. Application use cases stay transport-agnostic; wrapping happens at the edge.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
void bootstrap();
