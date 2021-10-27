import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Logger from 'brologger';
import { ObjectId } from 'bson';
import * as express from 'express';

export class ServerErrorResponse {
  @ApiProperty()
  public name: string;
  @ApiProperty()
  public message: string;
  @ApiPropertyOptional()
  public code?: string;
  @ApiProperty()
  public failureId: string;

  constructor(name: string, message: string, failureId: string, code?: string) {
    this.name = name;
    this.message = message;
    this.code = code;
    this.failureId = failureId;
  }
}

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter<Error> {
  constructor(@Inject('Logger') private readonly logger: Logger) {}

  public catch(error: Error & { code?: string }, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<express.Response>();
    if (error instanceof HttpException) {
      if (error.getStatus() === 404) {
        return response.status(404).end();
      }
    }
    const failureId = new ObjectId().toHexString();
    this.logger
      .message(error.message)
      .object({
        name: error.name,
        stack: error.stack,
        failureId,
      })
      .error();
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        new ServerErrorResponse(
          error.name,
          error.message,
          failureId,
          error.code,
        ),
      );
  }
}
