import { HttpModule, Module } from '@nestjs/common';

import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { LoggerModule } from '@tenant/logger';
import { MongooseModule } from '@nestjs/mongoose';
import { OccupantSchema } from './tenant.schema';

@Module({
  imports: [LoggerModule, HttpModule.register({timeout: 5000}), MongooseModule.forFeature([{ name: 'Occupant', schema: OccupantSchema }])],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}
