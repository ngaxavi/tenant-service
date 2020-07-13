import { EventHandler } from './events/event.handler';
import { CommandHandler } from './commands/command.handler';
import { Module } from '@nestjs/common';

import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { LoggerModule } from '@tenant/logger';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantSchema } from './tenant.schema';

@Module({
  imports: [LoggerModule, MongooseModule.forFeature([{ name: 'Tenant', schema: TenantSchema }])],
  controllers: [TenantController],
  providers: [TenantService, CommandHandler, EventHandler],
})
export class TenantModule {}
