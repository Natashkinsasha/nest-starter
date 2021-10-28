import { Module } from '@nestjs/common';
import UserController from '../controller/UserController';
import UserMaintainer from '../maintainer/UserMaintainer';
import UserRepository from '../repository/UserRepository';
import UserService from '../service/UserService';
import ConfigModule from './ConfigModule';
import { LoggerModule } from './LoggerModules';
import MongoModule from './MongoModule';

@Module({
  imports: [MongoModule, LoggerModule, ConfigModule],
  providers: [UserRepository, UserService, UserMaintainer],
  controllers: [UserController],
  exports: [UserService, UserMaintainer, UserRepository],
})
export default class UserModule {}
