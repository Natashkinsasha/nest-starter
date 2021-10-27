import { Module } from '@nestjs/common';
import Logger from 'brologger';
import * as mongodb from 'mongodb';
import ConfigService from '../service/ConfigService';
import ConfigModule from './ConfigModule';
import { LoggerModule } from './LoggerModules';

const mongoClientFactory = {
  provide: 'MongoClient',
  useFactory: (
    configService: ConfigService,
    logger: Logger,
  ): Promise<mongodb.MongoClient> => {
    const MONGO_URL = configService.getConfig().MONGO_URL;
    return mongodb.MongoClient.connect(MONGO_URL, {
      maxPoolSize: 50,
    })
      .then((client: mongodb.MongoClient) => {
        logger.message(`Mongo started on ${MONGO_URL}`).log('state');
        return client;
      })
      .catch((error) => {
        logger.log('startupError', 'Attempt to connect with mongo was failed');
        throw error;
      });
  },
  inject: [ConfigService, 'Logger'],
};

@Module({
  imports: [LoggerModule, ConfigModule],
  providers: [mongoClientFactory],
  exports: ['MongoClient'],
})
export default class MongoClientModule {}
