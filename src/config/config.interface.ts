export interface MongoConfig {
  uri: string;
  useCreateIndex?: boolean;
  useFindAndModify?: boolean;
  useNewUrlParser?: boolean;
  useUnifiedTopology?: boolean;
}

export interface MongoEnv {
  database?: string;
  user?: string;
  password?: string;
  host?: string;
  port?: string;
  uri?: string;
  credentials?: {
    uri?: string;
  };
}

export interface ConfigEnv {
  name: string;
  prefix: string;
  port?: number;
  mongo?: MongoEnv;
}

export interface Config {
  id: string;
  env: string;
  name: string;
  prefix: string;
  port: number;
  kafka: KafkaConfig;
  mongo: MongoConfig;
}

export interface KafkaConfig {
  clientId: string;
  brokerUris?: string[];
}
