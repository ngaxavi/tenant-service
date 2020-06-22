import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from './config';
import { TenantModule } from './tenant/tenant.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getMongo(),
      }),
      inject: [ConfigService],
    }),
    TenantModule,
  ],
})
export class AppModule {}
