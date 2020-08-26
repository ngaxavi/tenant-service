import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from './config';
import { TenantModule } from './tenant/tenant.module';
import { LoggerMiddleware, LoggerModule } from '@tenant/logger';
import { KafkaModule } from '@tenant/kafka';
import { AuthMiddleware } from '@tenant/auth';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.getAuth(),
    }),
    KafkaModule.forRootAsync(),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService.getMongo(),
      inject: [ConfigService],
    }),
    TenantModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
