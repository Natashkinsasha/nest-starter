import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import * as express from 'express';
import IPayloadDTO from '../DTO/IPayloadDTO';
import AuthError from '../error/AuthError';
import { AuthErrorCode } from '../error/error_codes/AuthErrorCode';
import * as authorization from 'auth-header';
import { compose, intersection, isEmpty } from 'ramda';
import ConfigService from '../service/ConfigService';
import JwtService from '../service/JwtService';
import safeCompare = require('safe-compare');

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (roles?.length) {
      return this.validate(request, roles);
    }
    return true;
  }

  public async validate(
    req: express.Request & { payload?: IPayloadDTO },
    roles: string[],
  ): Promise<boolean> {
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
      return true;
    }
    throw new AuthError({ code: AuthErrorCode.NOT_ACCESS });
  }
}
