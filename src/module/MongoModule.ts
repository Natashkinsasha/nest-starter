import { Module } from '@nestjs/common';
import MongoController from '../controller/MongoController';
import MongoMaintainer from '../maintainer/MongoMaintainer';
import MongoService from '../service/MongoService';
import MongoClientModule from './MongoClientModule';
import MongoDbModule from './MongoDbModule';
import ConfigModule from './ConfigModule';

@Module({
  imports: [MongoDbModule, MongoClientModule, ConfigModule],
  controllers: [MongoController],
  providers: [MongoService, MongoMaintainer],
  exports: [MongoDbModule, MongoClientModule],
})
export default class MongoModule {}
