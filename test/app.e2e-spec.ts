process.env.JWT_SECRET = 'e2e-jwt-secret-key-over-16-chars';

import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Clean architecture HTTP API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('registers, logs in, and charges a payment', async () => {
    const email = 'user@example.com';
    const password = 'password12';

    const reg = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password })
      .expect(201);
    const userId = (reg.body as { userId: string }).userId;
    expect(userId).toBeDefined();

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    expect((login.body as { accessToken: string }).accessToken).toBeDefined();

    const charge = await request(app.getHttpServer())
      .post('/payment/charge')
      .send({ userId, amount: 10.5, currency: 'USD' })
      .expect(200);
    expect((charge.body as { status: string }).status).toBe('completed');
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
