import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Patch,
  Request,
  Response,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiHeader,
  ApiProperty,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import * as express from 'express';
import ClientUserDTO from '../DTO/ClientUserDTO';
import IPayloadDTO from '../DTO/IPayloadDTO';
import UpdateUserDTO from '../DTO/UpdateUserDTO';
import ConsistencyError from '../error/ConsistencyError';
import { ServerErrorResponse } from '../filter/AllExceptionsFilter';
import { AuthErrorResponse } from '../filter/AuthExceptionFilter';
import UserMaintainer from '../maintainer/UserMaintainer';
import User from '../model/User';
import { ValidationPipe } from '../pipe/ValidationPipe';
import { UpdateModel } from 'repository-generic';

class UserUpdateResponse {
  @ApiProperty()
  public user: ClientUserDTO;

  constructor(user: User) {
    this.user = plainToClass<ClientUserDTO, User>(ClientUserDTO, user, {
      excludeExtraneousValues: true,
    });
  }
}

class UserGetByIdResponse {
  @ApiProperty()
  public user: ClientUserDTO;

  constructor(user: User) {
    this.user = plainToClass<ClientUserDTO, User>(ClientUserDTO, user, {
      excludeExtraneousValues: true,
    });
  }
}

class UserGetByTokenResponse {
  @ApiProperty()
  public user: ClientUserDTO;

  constructor(user: User) {
    this.user = plainToClass<ClientUserDTO, User>(ClientUserDTO, user, {
      excludeExtraneousValues: true,
    });
  }
}

@ApiTags('user')
@ApiBearerAuth()
@Controller({ path: 'user' })
export default class UserController {
  constructor(private readonly userMaintainer: UserMaintainer) {}

  @Patch('/me/force')
  @ApiOperation({ summary: 'Update user' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer ...',
  })
  @ApiHeader({
    name: 'X-AppVersion',
    description: '0.0.0',
  })
  @ApiOkResponse({
    description: 'User updated',
    type: UserUpdateResponse,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: ServerErrorResponse,
  })
  @ApiResponse({
    description: 'Authorization error',
    status: HttpStatus.UNAUTHORIZED,
    type: AuthErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
    type: ServerErrorResponse,
  })
  @ApiConsumes('application/json')
  public updateForceUser(
    @Body() user: UpdateModel<User>,
    @Request() req: express.Request & { payload: IPayloadDTO },
    @Response() res: express.Response,
  ) {
    const userId = req.payload.user.id;
    return this.userMaintainer
      .updateForceUser({ userId, user })
      .then((user: User) => {
        return res.status(HttpStatus.OK).json(new UserUpdateResponse(user));
      });
  }

  @Patch('/me')
  @ApiOperation({ summary: 'Update user' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer ...',
  })
  @ApiHeader({
    name: 'X-AppVersion',
    description: '0.0.0',
  })
  @ApiOkResponse({
    description: 'User updated',
    type: UserUpdateResponse,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: ServerErrorResponse,
  })
  @ApiResponse({
    description: 'Authorization error',
    status: HttpStatus.UNAUTHORIZED,
    type: AuthErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
    type: ServerErrorResponse,
  })
  @ApiConsumes('application/json')
  public updateUser(
    @Body(ValidationPipe) updateUserDTO: UpdateUserDTO,
    @Request() req: express.Request & { payload: IPayloadDTO },
    @Response() res: express.Response,
  ) {
    const userId = req.payload.user.id;
    return this.userMaintainer
      .updateUser({ userId, user: updateUserDTO })
      .then((user: User) => {
        return res.status(HttpStatus.OK).json(new UserUpdateResponse(user));
      });
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get user by auth token' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer ...',
  })
  @ApiHeader({
    name: 'X-AppVersion',
    description: '0.0.0',
  })
  @ApiOkResponse({
    description: 'User found',
    type: UserGetByTokenResponse,
  })
  @ApiResponse({
    description: 'Authorization error',
    status: HttpStatus.UNAUTHORIZED,
    type: AuthErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
    type: ServerErrorResponse,
  })
  @ApiConsumes('application/json')
  public getByToken(
    @Request() req: express.Request & { payload: IPayloadDTO },
    @Response() res: express.Response,
  ) {
    const userId: string = req.payload.user.id;
    return this.userMaintainer.getById({ userId }).then((user: User) => {
      if (!user) {
        throw new ConsistencyError({});
      }
      return res.status(HttpStatus.OK).json(new UserGetByTokenResponse(user));
    });
  }

  @Get('/:userId')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer ...',
  })
  @ApiHeader({
    name: 'X-AppVersion',
    description: '0.0.0',
  })
  @ApiOkResponse({
    description: 'User found',
    type: UserGetByIdResponse,
  })
  @ApiNotFoundResponse({
    description: 'User did not find',
  })
  @ApiResponse({
    description: 'Authorization error',
    status: HttpStatus.UNAUTHORIZED,
    type: AuthErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
    type: ServerErrorResponse,
  })
  @ApiConsumes('application/json')
  public getById(
    @Request() req: express.Request & { payload: IPayloadDTO },
    @Response() res: express.Response,
  ) {
    const userId: string = req.params.userId;
    return this.userMaintainer.getById({ userId }).then((user: User | void) => {
      if (user) {
        return res.status(HttpStatus.OK).json(new UserGetByIdResponse(user));
      }
      return res.status(HttpStatus.NOT_FOUND).end();
    });
  }

  @Delete('/me')
  @ApiOperation({ summary: 'Delete user by auth token' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer ...',
  })
  @ApiHeader({
    name: 'X-AppVersion',
    description: '0.0.0',
  })
  @ApiResponse({
    description: 'User deleted',
    status: HttpStatus.NO_CONTENT,
  })
  @ApiResponse({
    description: 'Authorization error',
    status: HttpStatus.UNAUTHORIZED,
    type: AuthErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
    type: ServerErrorResponse,
  })
  public deleteByToken(
    @Request() req: express.Request & { payload: IPayloadDTO },
    @Response() res: express.Response,
  ) {
    const userId: string = req.payload.user.id;
    return this.userMaintainer.deleteById({ userId }).then(() => {
      return res.status(HttpStatus.NO_CONTENT).end();
    });
  }
}
