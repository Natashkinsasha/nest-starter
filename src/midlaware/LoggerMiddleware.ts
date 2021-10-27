import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import Logger from 'brologger';
import * as express from 'express';
import expressBrologger from 'express-brologger';

@Injectable()
export default class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject('Logger') private readonly logger: Logger) {}

  public use(
    req: express.Request,
    res: express.Response & { body: any },
    next: express.NextFunction,
  ): any {
    return expressBrologger({
      loggerInstance: this.logger,
      getLogInfo: (req, res) => {
        const message = `HTTP ${res.statusCode} ${req.method} ${req.url}`;
        return {
          message,
          object: clean({
            req: {
              url: req.url,
              method: req.method,
              headers: req.headers,
              body: typeof req.body === 'object' ? req.body : undefined,
            },
            res: {
              statusCode: res.statusCode,
              headers: res.getHeaders(),
              body: typeof res.body === 'object' ? res.body : undefined,
            },
          }),
        };
      },
    })(req, res, next);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
function clean(obj: object) {
  return JSON.parse(JSON.stringify(obj));
}
