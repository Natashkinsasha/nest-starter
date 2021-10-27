import { Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import ConfigService from '../service/ConfigService';

const mailerFactory = {
  provide: 'Mailer',
  useFactory: (): Mail => {
    return nodemailer.createTransport({
      service: 'Yandex',
      auth: {
        user: 'test',
        pass: 'test',
      },
    });
  },
};

@Module({
  providers: [mailerFactory, ConfigService],
  exports: ['Mailer'],
})
export default class MailerModule {}
