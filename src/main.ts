import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(configService.getPrefix());

  app.connectMicroservice<MicroserviceOptions>({
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

  await app.listen(configService.getPort());
  console.log(
    `${configService.getConfig().name} (${configService.getConfig().id}) running on port ${configService.getPort()}`,
  );
}
bootstrap();