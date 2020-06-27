import { LoggerService as BaseLoggerService } from '@nestjs/common';
import { inspect } from 'util';
import { Logger, createLogger, format, transports } from 'winston';

const consoleFormat = format.combine(
  format.json(),
  format.timestamp({ format: 'HH:mm:ss.SSS' }),
  format.colorize(),
  format.printf((info) => {
    const msg = typeof info.message === 'object' ? inspect(info.message, { depth: 4 }) : info.message;
    return `[${info.level}] ${info.timestamp}   ${msg}`;
  }),
);

export class LoggerService implements BaseLoggerService {
  private readonly logger: Logger;

  constructor() {
    const env = process.env.NODE_ENV || 'development';
    const level = process.env.LOG_LEVEL || 'debug';

    if (env === 'production') {
      this.logger = createLogger({
        transports: [new transports.Console({ format: consoleFormat, level, stderrLevels: [] })],
      });
    } else if (env === 'test') {
      this.logger = createLogger({
        transports: [new transports.Console({ format: consoleFormat, level: 'warn', stderrLevels: [] })],
      });
    } else {
      this.logger = createLogger({
        transports: [new transports.Console({ format: consoleFormat, level, stderrLevels: [] })],
      });
    }
  }

  verbose(message: any, metadata?: any) {
    this.logger.verbose(message, metadata);
  }

  debug(message: any, metadata?: any) {
    this.logger.debug(message, metadata);
  }

  log(message: any, metadata?: any) {
    this.logger.info(message, metadata);
  }

  warn(message: any, metadata?: any) {
    this.logger.warn(message, metadata);
  }

  error(error: any, metadata?: any) {
    if (error instanceof Error) {
      this.logger.error(`${error.message}\n${error.stack}`, metadata);
    } else {
      this.logger.error(error, metadata);
    }
  }
}
