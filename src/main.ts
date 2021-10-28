import { NestFactory, Reflector } from '@nestjs/core';
import axios, { AxiosError } from 'axios';
import { NestExpressApplication } from '@nestjs/platform-express';
import Logger from 'brologger';
import 'reflect-metadata';
import * as throng from 'throng';
import AllExceptionsFilter from './filter/AllExceptionsFilter';
import ValidationExceptionFilter from './filter/ValidationExceptionFilter';
import AppModule from './module/AppModule';
import ConfigService from './service/ConfigService';
import NestLoggerService from './service/NestLoggerService';
import ConsistencyErrorFilter from './filter/ConsistencyErrorFilter';
import MongoValidationError from './filter/MongoValidationError';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import AuthExceptionFilter from './filter/AuthExceptionFilter';
import JwtService from './service/JwtService';
import { AuthGuard } from './guard/AuthGuard';

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // eslint-disable-next-line no-param-reassign
    error.message = `${error.message}. URL - ${error?.config?.url}.`;
    throw error;
  },
);

function buildSwaggerDocument(app: NestExpressApplication) {
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const npm_package_name = configService.getConfig().npm_package_name;
  const NODE_ENV = configService.getConfig().NODE_ENV;
  const documentBuilder = new DocumentBuilder()
    .setTitle(`${npm_package_name} API`)
    .setDescription(`The ${npm_package_name} API description`)
    .setVersion('1.0')
    .addServer('https://')
    .addServer('http://')
    .addBearerAuth({ type: 'http' }, 'header');
  if (NODE_ENV === 'production') {
    documentBuilder.addServer('');
  } else {
    documentBuilder.addServer('');
  }
  const options = documentBuilder.build();
  return SwaggerModule.createDocument(app, options);
}

export async function createApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger: Logger = app.get<Logger>('Logger');
  app.useLogger(new NestLoggerService(logger));
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });
  app.set('trust proxy');
  app.useGlobalFilters(
    new AllExceptionsFilter(logger),
    new ValidationExceptionFilter(logger),
    new ConsistencyErrorFilter(logger),
    new MongoValidationError(logger),
    new AuthExceptionFilter(logger),
  );
  const document = buildSwaggerDocument(app);
  SwaggerModule.setup('api-doc', app, document);
  const jwtService: JwtService = app.get<JwtService>(JwtService);
  const reflector = app.get<Reflector>(Reflector);
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  app.useGlobalGuards(new AuthGuard(reflector, configService, jwtService));
  return app;
}

async function bootstrap() {
  const app = await createApp();
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const PORT = configService.getConfig().PORT;
  const logger: Logger = app.get<Logger>('Logger');
  await app.listen(PORT, async () => {
    logger.log('state', `Server started on port: ${PORT}`);
  });
}
const WORKERS = 1;

throng({
  start: bootstrap,
  workers: WORKERS,
  grace: 6000,
});
