import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller('tenant')
export class TenantController implements OnModuleInit {
  constructor(
    private readonly tenantService: TenantService,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

  @Get()
  async findAll(): Promise<any> {
    return {
      name: 'Greeting',
      message: 'Welcome to Tenant service',
    };
  }
}
