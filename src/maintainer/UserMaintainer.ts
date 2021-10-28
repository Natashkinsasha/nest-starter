import { Injectable } from '@nestjs/common';
import UpdateUserDTO from '../DTO/UpdateUserDTO';
import ConsistencyError from '../error/ConsistencyError';
import User from '../model/User';
import UserService from '../service/UserService';
import { UpdateModel } from 'repository-generic';
import { ObjectId } from 'mongodb';

@Injectable()
export default class UserMaintainer {
  constructor(private readonly userService: UserService) {}

  public updateUser({
    userId,
    user,
  }: {
    userId: string;
    user: UpdateUserDTO;
  }): Promise<User> {
    return this.userService
      .update(new ObjectId(userId), user)
      .then(async (newUser) => {
        if (!newUser) {
          throw new ConsistencyError({});
        }
        return newUser;
      });
  }

  public updateForceUser({
    userId,
    user,
  }: {
    userId: string;
    user: UpdateModel<User>;
  }) {
    return this.userService.update(new ObjectId(userId), user).then((user) => {
      if (!user) {
        throw new ConsistencyError({});
      }
      return user;
    });
  }

  public getById({ userId }: { userId: string }): Promise<User | void> {
    return this.userService.findById(new ObjectId(userId));
  }

  public deleteById({ userId }: { userId: string }): Promise<void> {
    return this.userService
      .deleteById(new ObjectId(userId))
      .then((isDeleted: boolean) => {
        if (!isDeleted) {
          throw new ConsistencyError({});
        }
        return;
      });
  }
}
