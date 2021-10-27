import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Logger from 'brologger';
import { ObjectId } from 'bson';
import { ValidationError as LibValidationError } from 'class-validator';
import * as express from 'express';
import ValidationError from '../error/ValidationError';

enum ValidationErrorName {
  ValidationError = 'ValidationError',
}

export class ValidationErrorResponse {
  @ApiProperty({ enum: ValidationErrorName })
  public name: string;
  @ApiProperty()
  public message: string;
  @ApiPropertyOptional()
  public code?: string;
  @ApiProperty()
  public failureId: string;
  @ApiProperty()
  public errors: ReadonlyArray<LibValidationError>;

  constructor(
    name: string,
    message: string,
    failureId: string,
    errors: ReadonlyArray<LibValidationError>,
    code?: string,
  ) {
    this.name = name;
    this.message = message;
    this.code = code;
    this.errors = errors;
    this.failureId = failureId;
  }
}

@Catch(ValidationError)
export default class ValidationExceptionFilter
  implements ExceptionFilter<ValidationError>
{
  constructor(@Inject('Logger') private readonly logger: Logger) {}

  public catch(error: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<express.Response>();
    const failureId = new ObjectId().toHexString();
    this.logger
      .message(error.message)
      .object({
        name: error.name,
        code: error.code,
        stack: error.stack,
        errors: error.errors,
        failureId,
      })
      .warn();
    return response
      .status(400)
      .json(
        new ValidationErrorResponse(
          error.name,
          error.message,
          failureId,
          error.errors,
          error.code,
        ),
      );
  }
}
