import { Test, TestingModule } from '@nestjs/testing';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

describe('AppController', () => {
  let tenantController: TenantController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [TenantService],
    }).compile();

    tenantController = app.get<TenantController>(TenantController);
  });

  describe('root', () => {
    it('should return Greeting Message', async done => {
      expect(await tenantController.findAll()).toEqual({
        name: 'Greeting',
        message: 'Welcome to Tenant service',
      });
      done();
    });
  });
});
