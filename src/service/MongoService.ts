import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import MongoDbHelper from '../helper/MongoDbHelper';

@Injectable()
export default class MongoService {
  constructor(@Inject('MongoDbModule') private readonly db: Db) {}

  public drop = (): Promise<ReadonlyArray<boolean>> => {
    return MongoDbHelper.dropAll(this.db);
  };
}
