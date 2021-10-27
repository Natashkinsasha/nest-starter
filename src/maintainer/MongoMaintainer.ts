import { Injectable } from '@nestjs/common';
import MongoService from '../service/MongoService';
import ConfigService from '../service/ConfigService';

@Injectable()
export default class MongoMaintainer {
  constructor(
    private readonly mongoService: MongoService,
    private readonly configService: ConfigService,
  ) {}

  public drop(): Promise<ReadonlyArray<boolean>> {
    if (this.configService.getConfig().NODE_ENV !== 'test') {
      throw new Error('Can use this endpoint only in test environment');
    }
    return this.mongoService.drop();
  }
}
