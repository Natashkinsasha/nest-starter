import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import ValidationError from '../error/ValidationError';
import { removeUndefinedFields } from '../util';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  public async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value, {
      excludeExtraneousValues: true,
    });
    if (!object) {
      return value;
    }
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new ValidationError({ errors });
    }
    return removeUndefinedFields(object);
  }

  private toValidate(
    metatype: new (...args: any[]) => any | undefined,
  ): boolean {
    const types: ReadonlyArray<any> = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
