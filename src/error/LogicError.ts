import BaseError from './BaseError';

export default class LogicError extends BaseError {
  public readonly code?: string;

  constructor({
    message = 'Logic error',
    code,
  }: {
    message?: string;
    code?: string;
  }) {
    super(message);
    this.code = code;
  }
}
