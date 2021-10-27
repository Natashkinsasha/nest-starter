import { ValidationError as LibValidationError } from 'class-validator';
import LogicError from './LogicError';

export default class ValidationError extends LogicError {
  public errors: ReadonlyArray<LibValidationError>;

  constructor({
    message = 'Validation error',
    code,
    errors,
  }: {
    message?: string;
    code?: string;
    errors: ReadonlyArray<LibValidationError>;
  }) {
    super({ message, code });
    this.errors = errors || [];
  }
}
