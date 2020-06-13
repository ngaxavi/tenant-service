import { Config, MongoConfig, KafkaConfig } from './config.interface';
import { v4 as uuid } from 'uuid';

export class ConfigService {
  private config: Config;

  constructor() {
    const kafka: KafkaConfig = {
      clientId: 'demo',
    };

    const kafkaHost = process.env.KAFKA_HOST || 'localhost';
    const kafkaPort = process.env.KAFKA_PORT || '9092';

    kafka.brokerUris = [`${kafkaHost}:${kafkaPort}`];

    const mongo: MongoConfig = {
      uri: process.env.MONGO_URI || '',
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const user = process.env.MONGO_USER || '';
    const password = process.env.MONGO_PASSWORD || '';
    const credentials = user && password ? `${user}:${password}@` : '';
    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || '27017';
    const database = process.env.MONGO_DB || '';
    mongo.uri = process.env.MONGO_URI || `mongodb://${credentials}${host}:${port}/${database}`;

    this.config = {
      id: uuid(),
      name: 'tenant-service',
      port: +process.env.PORT || 3000,
      prefix: process.env.PREFIX || 'api',
      env: process.env.NODE_ENV || 'development',
      kafka,
      mongo,
    };
  }

  public getConfig(): Config {
    return this.config;
  }

  public getMongo(): MongoConfig {
    return this.config.mongo;
  }

  public getPort(): number {
    return this.config.port;
  }

  public getPrefix(): string {
    return this.config.prefix;
  }

  public getKafka(): KafkaConfig {
    return this.config.kafka;
  }
}
