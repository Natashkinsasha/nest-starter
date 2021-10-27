import { Controller, Get, Request, Response } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import MongoMaintainer from '../maintainer/MongoMaintainer';

@ApiTags('mongo')
@ApiBearerAuth()
@Controller('mongo')
export default class MongoController {
  constructor(private readonly mongoMaintainer: MongoMaintainer) {}

  @Get('drop')
  public drop(
    @Request() req: express.Request,
    @Response() res: express.Response,
  ): Promise<void | express.Response> {
    return this.mongoMaintainer.drop().then(() => res.status(200).end());
  }
}
