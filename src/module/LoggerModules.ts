import { Module } from '@nestjs/common';
import Logger, { ConsoleTransport, Transport } from 'brologger';
import * as Mail from 'nodemailer/lib/mailer';
import * as util from 'util';
import ConfigService from '../service/ConfigService';
import ConfigModule from './ConfigModule';
import MailerModule from './MailerModule';

const levels = {
  alert: 0,
  startupError: 1,
  error: 2,
  warn: 3,
  state: 4,
  prof: 5,
  info: 6,
  debug: 7,
};

const colors = {
  alert: 'red',
  startupError: 'red',
  error: 'red',
  warn: 'cyan',
  state: 'green',
  prof: 'blue',
  info: 'yellow',
  debug: 'gray',
};

const loggerFactory = {
  provide: 'Logger',
  useFactory: async (
    configService: ConfigService,
    mailer: Mail,
  ): Promise<Logger> => {
    const { PROJECT_NAME, LOG_LEVEL, NODE_ENV } = configService.getConfig();
    const transports: Array<Transport> = [new ConsoleTransport({ colors })];
    const logger = new Logger({
      logLevel: LOG_LEVEL,
      meta: {
        projectName: PROJECT_NAME,
        env: NODE_ENV,
        version: process.env.npm_package_version || '0.0.0',
      },
      levels,
      transports,
    });
    logger.on('error', async (err: Error) => {
      // eslint-disable-next-line no-console
      console.log(err);
      return mailer.sendMail({
        from: '',
        to: [],
        subject: `Multiverse error ${NODE_ENV}`,
        text: util.inspect(err, { depth: Infinity }),
      });
    });
    return logger;
  },
  inject: [ConfigService, 'Mailer'],
};

@Module({
  imports: [MailerModule, ConfigModule],
  providers: [loggerFactory],
  exports: ['Logger'],
})
export class LoggerModule {}
