import { Module } from '@nestjs/common';
import AuthController from '../controller/AuthController';
import AuthMaintainer from '../maintainer/AuthMaintainer';
import JwtService from '../service/JwtService';
import ConfigModule from './ConfigModule';
import { LoggerModule } from './LoggerModules';
import UserModule from './UserModule';

@Module({
  imports: [UserModule, LoggerModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthMaintainer, JwtService],
})
export default class AuthModule {}
