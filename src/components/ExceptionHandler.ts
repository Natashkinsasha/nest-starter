import { Inject } from '@nestjs/common';
import Logger from 'brologger';
import { ObjectId } from 'bson';

export class ExceptionHandler {
  constructor(@Inject('Logger') private readonly logger: Logger) {}

  public handle(error: Error) {
    const failureId = new ObjectId().toHexString();
    this.logger
      .message(error.message)
      .object({
        name: error.name,
        stack: error.stack,
        failureId,
      })
      .error();
  }
}
