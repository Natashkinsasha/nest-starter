import { AuthErrorCode } from './error_codes/AuthErrorCode';
import LogicError from './LogicError';

export default class AuthError extends LogicError {
  constructor({
    message = 'Auth error',
    code,
  }: {
    message?: string;
    code?: AuthErrorCode;
  }) {
    super({ message, code });
  }
}
