import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '../src/config';
import { TenantModule } from '../src/tenant/tenant.module';

describe('TenantController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), TenantModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 60000);

  afterAll(async () => {
    await app.close();
  }, 60000);

  it('/api/tenant (GET)', async done => {
    await request(app.getHttpServer())
      .get('/api/tenant')
      .expect(200)
      .expect({
        name: 'Greeting',
        message: 'Welcome to Tenant service',
      });

    done();
  });
});
