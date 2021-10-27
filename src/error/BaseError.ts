export default class BaseError extends Error {
  constructor(message = 'Base error') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
