import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as requestId from 'express-request-id';
import * as compression from 'compression';
import LoggerMiddleware from '../midlaware/LoggerMiddleware';
import ConfigModule from './ConfigModule';
import Logger from 'brologger';
import { LoggerModule } from './LoggerModules';
import * as bodyParser from 'body-parser';
import MongoModule from './MongoModule';

@Module({
  imports: [ConfigModule, LoggerModule, MongoModule],
})
export default class AppModule implements NestModule {
  constructor(@Inject('Logger') private readonly logger: Logger) {}

  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cors(),
        helmet(),
        compression(),
        requestId(),
        // ResponseTimeMiddleware,
        LoggerMiddleware,
        bodyParser.json({ limit: '5mb' }),
      )
      .forRoutes('*');
  }
}