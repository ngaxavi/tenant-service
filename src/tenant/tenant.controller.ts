import { Controller, Get } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  async findAll(): Promise<any> {
    return {
      name: 'Greeting',
      message: 'Welcome to Tenant service',
    };
  }
}
