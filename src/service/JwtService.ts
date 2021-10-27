import { Inject, Injectable } from '@nestjs/common';
import * as BPromise from 'bluebird';
import * as jwt from 'jsonwebtoken';
import IPayloadDTO from '../DTO/IPayloadDTO';
import User from '../model/User';
import ConfigService from './ConfigService';

@Injectable()
export default class JwtService {
  constructor(@Inject('ConfigService') private configService: ConfigService) {}

  public createTokens = (
    user: User,
  ): BPromise<{
    accessToken: string;
    refreshToken: string;
  }> => {
    return BPromise.props({
      accessToken: this.createAccessToken(user),
      refreshToken: this.createRefreshToken(user),
    });
  };

  public verifyToken(token: string): IPayloadDTO {
    const SECRET_KEY = this.configService.getConfig().SECRET_KEY;
    return jwt.verify(token, SECRET_KEY, {
      ignoreExpiration: true,
    }) as IPayloadDTO;
  }

  private createAccessToken = (user: User): BPromise<string> => {
    return BPromise.try(() => {
      const payload: IPayloadDTO = {
        user: { id: user._id.toHexString(), roles: user.roles },
      };
      const SECRET_KEY = this.configService.getConfig().SECRET_KEY;
      const ACCESS_TOKEN_LIFE_TIME =
        this.configService.getConfig().ACCESS_TOKEN_LIFE_TIME;
      return jwt.sign(payload, SECRET_KEY, {
        expiresIn: ACCESS_TOKEN_LIFE_TIME,
      });
    });
  };

  private createRefreshToken = (user: User): BPromise<string> => {
    return BPromise.try(() => {
      const payload: IPayloadDTO = {
        user: { id: user._id.toHexString(), roles: user.roles },
      };
      const SECRET_KEY = this.configService.getConfig().SECRET_KEY;
      const REFRESH_TOKEN_LIFE_TIME =
        this.configService.getConfig().REFRESH_TOKEN_LIFE_TIME;
      return jwt.sign(payload, SECRET_KEY, {
        expiresIn: REFRESH_TOKEN_LIFE_TIME,
      });
    });
  };
}
