import { Inject, Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { ClassType, MongoRepository } from 'repository-generic';
import User from '../model/User';

@Injectable()
export default class UserRepository extends MongoRepository<User, User> {
  constructor(
    @Inject('MongoDbModule') db: Db,
    @Inject('MongoClient') mongoClient: MongoClient,
  ) {
    super(db, mongoClient, {
      validateUpdate: true,
      validateReplace: true,
      validateAdd: true,
      validateGet: true,
      // classTransformOptions: { excludeExtraneousValues: true },
      customTransform: (value) => value,
    });
  }

  protected getClass(): ClassType<User> {
    return User;
  }
}
