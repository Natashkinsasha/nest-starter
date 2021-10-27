import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import * as authorization from 'auth-header';
import * as express from 'express';
import { compose, intersection, isEmpty } from 'ramda';
import safeCompare = require('safe-compare');
import IPayloadDTO from '../DTO/IPayloadDTO';
import AuthError from '../error/AuthError';
import { AuthErrorCode } from '../error/error_codes/AuthErrorCode';
import ConfigService from '../service/ConfigService';
import JwtService from '../service/JwtService';

@Injectable()
export default class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject('ConfigService') private readonly configService: ConfigService,
    @Inject('JwtService') private readonly jwtService: JwtService,
  ) {}

  public use(
    req: express.Request & { payload?: IPayloadDTO },
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    return this.validate(req)
      .then(() => next())
      .catch(next);
  }

  public async validate(req: express.Request & { payload?: IPayloadDTO }) {
    const roles: ReadonlyArray<string> = [];
    const TOKEN_HEADER = this.configService.getConfig().TOKEN_HEADER;
    const token: string | undefined = req.get(TOKEN_HEADER);
    if (!token) {
      throw new AuthError({ code: AuthErrorCode.ABSENT_TOKEN });
    }
    const auth = authorization.parse(token);
    if (!safeCompare(auth.scheme, 'Bearer')) {
      throw new AuthError({ code: AuthErrorCode.INVALID_TOKEN });
    }
    const authToken: string | null = auth.token as string | null;
    if (!authToken) {
      throw new AuthError({ code: AuthErrorCode.INVALID_TOKEN });
    }
    const payload: IPayloadDTO = this.jwtService.verifyToken(authToken);
    req.payload = payload;
    if (isEmpty(roles)) {
      return;
    }
    if (
      payload.user &&
      payload.user.roles &&
      !compose(isEmpty, intersection(roles))(payload.user.roles)
    ) {
      return;
    }
    throw new AuthError({ code: AuthErrorCode.NOT_ACCESS });
  }
}
