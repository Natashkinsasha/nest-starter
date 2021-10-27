import { ArgumentMetadata, ParseBoolPipe } from '@nestjs/common';

export default class OptionParseBoolPipe extends ParseBoolPipe {
  public async transform(
    value: string | boolean,
    metadata: ArgumentMetadata,
  ): Promise<boolean> {
    if (!value) {
      return false;
    }
    return super.transform(value, metadata);
  }
}
