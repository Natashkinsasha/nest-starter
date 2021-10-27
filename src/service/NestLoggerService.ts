import { LoggerService } from '@nestjs/common';
import Logger from 'brologger';

export default class NestLoggerService implements LoggerService {
  constructor(private readonly logger: Logger) {}

  public log(message: any, context?: string): any {
    this.logger.message(message).meta({ context }).info();
  }

  public error(message: any, trace?: string, context?: string): any {
    this.logger.message(message).object({ trace }).meta({ context }).error();
  }

  public warn(message: any, context?: string): any {
    this.logger.message(message).meta({ context }).warn();
  }

  public debug?(message: any, context?: string): any {
    this.logger.message(message).meta({ context }).debug();
  }

  public verbose?(message: any, context?: string): any {
    this.logger.message(message).meta({ context }).debug();
  }
}
