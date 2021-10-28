import { Inject, Injectable } from '@nestjs/common';
import { CreateModel } from 'repository-generic';
import GuestUserDTO from '../DTO/GuestUserDTO';
import IPayloadDTO from '../DTO/IPayloadDTO';
import ConsistencyError from '../error/ConsistencyError';
import User from '../model/User';
import JwtService from '../service/JwtService';
import UserService from '../service/UserService';
import { ObjectId } from 'mongodb';

@Injectable()
export default class AuthMaintainer {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async authGuest({
    user: guestUserDTO,
  }: {
    user: GuestUserDTO;
  }): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userService.create(
      await this.createDefaultUser(guestUserDTO),
    );
    const { accessToken, refreshToken } = await this.jwtService.createTokens(
      user,
    );
    return { user, accessToken, refreshToken };
  }

  public refreshTokens({
    refreshToken,
  }: {
    refreshToken: string;
  }): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const payload: IPayloadDTO = this.jwtService.verifyToken(refreshToken);
    return this.userService
      .findById(new ObjectId(payload.user.id))
      .then(async (user: User | void) => {
        if (!user) {
          throw new ConsistencyError({});
        }
        const { accessToken, refreshToken } =
          await this.jwtService.createTokens(user);
        return { user, accessToken, refreshToken };
      });
  }

  private async createDefaultUser(
    user: Partial<User>,
  ): Promise<CreateModel<User>> {
    return {
      roles: [],
      ...user,
    };
  }
}
