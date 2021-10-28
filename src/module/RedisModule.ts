import { Module } from '@nestjs/common';
import Logger from 'brologger';
import * as redis from 'redis';
import ConfigService from '../service/ConfigService';
import ConfigModule from './ConfigModule';
import { LoggerModule } from './LoggerModules';

const redisClientFactory = {
  provide: 'RedisClient',
  useFactory: (
    configService: ConfigService,
    logger: Logger,
  ): Promise<redis.RedisClient> => {
    return new Promise((resolve, reject) => {
      const REDIS_URL: string = configService.getConfig().REDIS_URL;
      const redisClient = redis.createClient(REDIS_URL);
      const timer = setTimeout(() => {
        logger.log('startupError', 'The time limit for connecting to Redis');
        return reject(new Error('The time limit for connecting to Redis'));
      }, 10000);
      redisClient.on('connect', () => {
        logger
          .message(`StartAloneRedis connection open on ${REDIS_URL}`)
          .log('state');
      });
      redisClient.on('ready', () => {
        logger.message('StartAloneRedis ready').log('state');
        clearTimeout(timer);
        return resolve(redisClient);
      });

      redisClient.on('error', (err: Error) => {
        logger
          .message(err.message)
          .object({ name: err.name, stack: err.stack })
          .log('state');
      });

      redisClient.on('close', () => {
        logger.message('StartAloneRedis close').warn();
      });

      redisClient.on('reconnecting', () => {
        logger.message('StartAloneRedis reconnecting').warn();
      });

      redisClient.on('end', () => {
        logger.message('StartAloneRedis end').warn();
      });

      redisClient.on('select', () => {
        logger.message('StartAloneRedis select').warn();
      });
    });
  },
  inject: [ConfigService, 'Logger'],
};

@Module({
  imports: [LoggerModule, ConfigModule],
  providers: [redisClientFactory, ConfigService],
  exports: ['RedisClient'],
})
export default class RedisModule {}
