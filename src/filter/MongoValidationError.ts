import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Logger from 'brologger';
import { ObjectId } from 'bson';
import { ValidationError as LibValidationError } from 'class-validator';
import * as express from 'express';
import { RepositoryValidationError } from 'repository-generic';

export class RepositoryValidationErrorResponse {
  @ApiProperty()
  public name: string;
  @ApiProperty()
  public message: string;
  @ApiProperty()
  public failureId: string;
  @ApiPropertyOptional()
  public errors: ReadonlyArray<string>;

  constructor(
    name: string,
    message: string,
    failureId: string,
    errors: ReadonlyArray<LibValidationError>,
  ) {
    this.name = name;
    this.message = message;
    this.errors = errors.reduce((tmp, error: LibValidationError) => {
      return (
        (error.constraints && [...tmp, ...Object.values(error.constraints)]) ||
        tmp
      );
    }, []);
    this.failureId = failureId;
  }
}

@Catch(RepositoryValidationError)
export default class MongoValidationError
  implements ExceptionFilter<RepositoryValidationError>
{
  constructor(@Inject('Logger') private readonly logger: Logger) {}

  public catch(error: RepositoryValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<express.Response>();
    const failureId = new ObjectId().toHexString();
    this.logger
      .message(error.message)
      .object({
        name: error.name,
        errors: error.errors,
        stack: error.stack,
        failureId,
      })
      .error();
    return response
      .status(500)
      .json(
        new RepositoryValidationErrorResponse(
          error.name,
          error.message,
          failureId,
          error.errors,
        ),
      );
  }
}
