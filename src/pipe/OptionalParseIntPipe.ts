import { ArgumentMetadata, ParseIntPipe } from '@nestjs/common';
import { ParseIntPipeOptions } from '@nestjs/common/pipes/parse-int.pipe';
export default class OptionalParseIntPipe {
  private readonly parseIntPipe: ParseIntPipe;

  constructor(options?: ParseIntPipeOptions) {
    this.parseIntPipe = new ParseIntPipe(options);
  }

  public async transform(
    value: string | undefined,
    metadata: ArgumentMetadata,
  ): Promise<number | undefined> {
    if (value === undefined) {
      return undefined;
    }
    return this.parseIntPipe.transform(value, metadata);
  }
}
