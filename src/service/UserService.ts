import { Inject, Injectable } from '@nestjs/common';
import { CreateModel, UpdateModel } from 'repository-generic';
import User from '../model/User';
import UserRepository from '../repository/UserRepository';
import { ObjectId } from 'mongodb';

@Injectable()
export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public create(user: CreateModel<User>): Promise<User> {
    return this.userRepository.add(user);
  }

  public update(id: ObjectId, user: UpdateModel<User>): Promise<User | void> {
    return this.userRepository.update(id, user);
  }

  public findById(id: ObjectId): Promise<User | void> {
    return this.userRepository.get(id);
  }

  public deleteById(id: ObjectId): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
