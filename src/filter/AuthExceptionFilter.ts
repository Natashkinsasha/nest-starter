import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Logger from 'brologger';
import { ObjectId } from 'bson';
import * as express from 'express';
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';
import AuthError from '../error/AuthError';
import { AuthErrorCode } from '../error/error_codes/AuthErrorCode';

enum AuthErrorName {
  AuthError = 'AuthError',
  JsonWebTokenError = 'JsonWebTokenError',
  TokenExpiredError = 'TokenExpiredError',
  NotBeforeError = 'NotBeforeError',
}

export class AuthErrorResponse {
  @ApiProperty({ enum: AuthErrorName })
  public name: AuthErrorName | string;
  @ApiProperty()
  public message: string;
  @ApiPropertyOptional({
    enum: ['NOT_ACCESS', 'INVALID_TOKEN', 'ABSENT_TOKEN'],
  })
  public code?: AuthErrorCode | string;
  @ApiProperty()
  public failureId: string;

  constructor(
    name: AuthErrorName | string,
    message: string,
    failureId: string,
    code?: AuthErrorCode | string,
  ) {
    this.name = name;
    this.message = message;
    this.code = code;
    this.failureId = failureId;
  }
}

@Catch(AuthError, JsonWebTokenError, TokenExpiredError, NotBeforeError)
export default class AuthExceptionFilter
  implements
    ExceptionFilter<
      AuthError | JsonWebTokenError | TokenExpiredError | NotBeforeError
    >
{
  constructor(@Inject('Logger') private readonly logger: Logger) {}

  public catch(
    error: AuthError | JsonWebTokenError | TokenExpiredError | NotBeforeError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<express.Response>();
    const failureId = new ObjectId().toHexString();
    if (error instanceof AuthError) {
      this.logger
        .message(error.message)
        .object({
          name: error.name,
          code: error.code,
          stack: error.stack,
          failureId,
        })
        .warn();
      return response
        .status(401)
        .json(
          new AuthErrorResponse(
            error.name,
            error.message,
            failureId,
            error.code,
          ),
        );
    }
    this.logger
      .message(error.message)
      .object({
        name: error.name,
        stack: error.stack,
        failureId,
      })
      .warn();
    return response
      .status(401)
      .json(new AuthErrorResponse(error.name, error.message, failureId));
  }
}
