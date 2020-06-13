import { Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { TenantModule } from './tenant/tenant.module';

@Module({
  imports: [ConfigModule.forRoot(), TenantModule],
})
export class AppModule {}
