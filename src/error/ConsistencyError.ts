import LogicError from './LogicError';

export default class ConsistencyError extends LogicError {
  constructor({
    message = 'Consistency error',
    code,
  }: {
    message?: string;
    code?: string;
  }) {
    super({ message, code });
  }
}
