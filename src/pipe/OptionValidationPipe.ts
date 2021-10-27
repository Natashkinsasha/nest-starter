import { ValidationPipe } from './ValidationPipe';
import { ArgumentMetadata } from '@nestjs/common';
import { isEmpty } from 'ramda';

export default class OptionValidationPipe extends ValidationPipe {
  public async transform(value: any, metadata: ArgumentMetadata) {
    if (!isEmpty(value)) {
      return super.transform(value, metadata);
    }
    return;
  }
}
