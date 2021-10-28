import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import Logger from 'brologger';
import * as http from 'http';
import * as responseTime from 'response-time';
import ConfigService from '../service/ConfigService';
import * as express from 'express';

@Injectable()
export default class ResponseTimeMiddleware implements NestMiddleware {
  constructor(
    @Inject('Logger') private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  public use(
    req: express.Request,
    res: express.Response & { body: any },
    next: express.NextFunction,
  ): any {
    const minResponseTime = this.configService.getConfig().MIN_RESPONSE_TIME;
    return responseTime(
      (
        request: http.IncomingMessage,
        response: http.ServerResponse,
        time: number,
      ) => {
        if (minResponseTime < time) {
          this.logger
            .message('Very slow request')
            .object({
              method: request.method,
              url: request.url,
              time,
              minResponseTime,
            })
            .error();
        }
        response.setHeader('X-Response-Time', time);
      },
    )(req, res, next);
  }
}
