import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import Logger from 'brologger';
import * as express from 'express';
import { ObjectId } from 'bson';
import ConsistencyError from '../error/ConsistencyError';

export class ConsistencyErrorResponse {
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

@Catch(ConsistencyError)
export default class ConsistencyErrorFilter
  implements ExceptionFilter<ConsistencyError>
{
  constructor(@Inject('Logger') private readonly logger: Logger) {}

  public catch(error: ConsistencyError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<express.Response>();
    const failureId = new ObjectId().toHexString();
    this.logger
      .message(error.message)
      .object({
        name: error.name,
        stack: error.stack,
        failureId,
      })
      .warn();
    return response
      .status(501)
      .json(new ConsistencyErrorResponse(error.name, error.message, failureId));
  }
}
