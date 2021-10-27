import { Module } from '@nestjs/common';
import ConfigService from '../service/ConfigService';

@Module({
  providers: [
    {
      useClass: ConfigService,
      provide: ConfigService,
    },
  ],
  exports: [ConfigService],
})
export default class ConfigModule {}
