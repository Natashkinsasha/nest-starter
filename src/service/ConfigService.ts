import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import Logger from 'brologger';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import * as config from 'node-config-env-value';
import Config from '../model/Config';

@Injectable()
export default class ConfigService {
  private readonly config: Config;

  constructor(private readonly moduleRef?: ModuleRef) {
    this.config = plainToClass(Config, config, {
      excludeExtraneousValues: true,
    });
  }

  public getConfig() {
    return this.config;
  }

  public async onApplicationBootstrap() {
    if (this.moduleRef) {
      const logger = this.moduleRef.get<Logger>('Logger', { strict: false });
      await validate(this.config, { validationError: { target: false } }).then(
        (errors) => {
          if (errors.length > 0) {
            logger
              .message('ValidationError in config!')
              .object({ errors })
              .error();
          }
        },
      );
    }
  }
}
