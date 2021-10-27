import { Injectable, PipeTransform } from '@nestjs/common';
import { isBooleanString } from 'class-validator';
import ValidationError from '../error/ValidationError';

@Injectable()
export class ValidationBooleanQueryPipe implements PipeTransform<any> {
  constructor(private readonly options?: { isOptional: boolean }) {}

  public async transform(value: any) {
    if (!value && this.options?.isOptional) {
      return value;
    }
    if (isBooleanString(value)) {
      return value;
    }
    throw new ValidationError({
      message: `${value} is not boolean type.`,
      errors: [],
    });
  }
}
