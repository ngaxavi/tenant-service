import { Module } from '@nestjs/common';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';

import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { ConfigService } from './../config';

@Module({
  controllers: [TenantController],
  providers: [
    TenantService,
    {
      provide: 'KAFKA_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getKafka().clientId,
              brokers: configService.getKafka().brokerUris,
            },
            consumer: {
              groupId: `${configService.getKafka().clientId}-consumer`,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class TenantModule {}
