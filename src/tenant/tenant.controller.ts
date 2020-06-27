import { Controller, Get, Inject, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { ClientKafka } from '@nestjs/microservices';
import { Roles, RolesGuard } from '@tenant/auth';

@Controller('tenants')
@UseGuards(RolesGuard)
@UsePipes(new ValidationPipe())
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
  ) {}


  @Get()
  @Roles('read')
  async findAll(): Promise<any> {
    return this.tenantService.findAll();
  }
}
