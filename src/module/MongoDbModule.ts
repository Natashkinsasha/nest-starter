import { Module } from '@nestjs/common';
import * as mongodb from 'mongodb';
import ConfigService from '../service/ConfigService';
import ConfigModule from './ConfigModule';
import { LoggerModule } from './LoggerModules';
import MongoClientModule from './MongoClientModule';

const mongoDbFactory = {
  provide: 'MongoDbModule',
  useFactory: (
    client: mongodb.MongoClient,
    configService: ConfigService,
  ): mongodb.Db => {
    const dbName = `${configService.getConfig().npm_package_name}_${
      configService.getConfig().NODE_ENV
    }`;
    return client.db(dbName);
  },
  inject: ['MongoClient', ConfigService],
};

@Module({
  imports: [LoggerModule, MongoClientModule, ConfigModule],
  providers: [mongoDbFactory],
  exports: ['MongoDbModule'],
})
export default class MongoDbModule {}
