import { EventHandler } from './events/event.handler';
import { Event } from './events/event';
import { CommandHandler } from './commands/command.handler';
import { ConfigService } from '@tenant/config';
import { Command } from './commands/command';
import { MongoPipe } from '@tenant/validation';
import {
  Controller,
  Get,
  Inject,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseFilters,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { ClientKafka } from '@nestjs/microservices';
import { Roles, RolesGuard } from '@tenant/auth';
import { KafkaExceptionFilter, KafkaTopic, KafkaEvent, KafkaCommand } from '@tenant/kafka';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Tenant } from './tenant.schema';
import { v4 as uuid } from 'uuid';

@Controller('tenants')
@UseGuards(RolesGuard)
@UseFilters(KafkaExceptionFilter)
@UsePipes(new ValidationPipe())
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly config: ConfigService,
    private readonly commandHandler: CommandHandler,
    private readonly eventHandler: EventHandler,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  @Post()
  // @Roles('create')
  async createOne(@Body() dto: CreateTenantDto): Promise<Tenant> {
    const tenant: Tenant = await this.tenantService.createOne(dto);

    const event = {
      id: uuid(),
      type: 'event',
      action: 'TenantCreated',
      timestamp: Date.now(),
      data: tenant,
    };

    this.kafkaClient.emit(`${this.config.getKafka().prefix}-tenant-event`, event);

    return tenant;
  }

  @Get()
  @Roles('read')
  async findAll(): Promise<Tenant[]> {
    return this.tenantService.findAll();
  }

  @Get('id')
  @Roles('read')
  async findOne(@Param('id', new MongoPipe()) id: string): Promise<Tenant> {
    return this.tenantService.findOne(id);
  }

  @KafkaTopic('tenant-command')
  async onCreateTenantCommand(@KafkaCommand() command: Command): Promise<void> {
    const tenant: Tenant = await this.commandHandler.handler(command);

    const event = {
      id: uuid(),
      type: 'event',
      action: 'TenantCreated',
      timestamp: Date.now(),
      data: tenant,
    };

    this.kafkaClient.emit(`${this.config.getKafka().prefix}-tenant-event`, event);

    console.log(command);
  }

  @KafkaTopic('building-event')
  async onBuilding(@KafkaEvent() event: Event): Promise<void> {
    await this.eventHandler.handleEvent(event);
  }
}
