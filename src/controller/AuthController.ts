import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Put,
  Request,
  Response,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiProperty,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import * as express from 'express';
import ClientUserDTO from '../DTO/ClientUserDTO';
import GuestUserDTO from '../DTO/GuestUserDTO';
import RefreshTokensDTO from '../DTO/RefreshTokensDTO';
import { ServerErrorResponse } from '../filter/AllExceptionsFilter';
import { AuthErrorResponse } from '../filter/AuthExceptionFilter';
import { ValidationErrorResponse } from '../filter/ValidationExceptionFilter';
import AuthMaintainer from '../maintainer/AuthMaintainer';
import User from '../model/User';
import { ValidationPipe } from '../pipe/ValidationPipe';

export class AuthResponse {
  @ApiProperty()
  public user: ClientUserDTO;
  @ApiProperty()
  public accessToken: string;
  @ApiProperty()
  public refreshToken: string;

  constructor(user: User, accessToken: string, refreshToken: string) {
    this.user = plainToClass<ClientUserDTO, User>(ClientUserDTO, user, {
      excludeExtraneousValues: true,
    });
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export class AuthUpdateTokensResponse {
  @ApiProperty()
  public user: ClientUserDTO;
  @ApiProperty()
  public accessToken: string;
  @ApiProperty()
  public refreshToken: string;

  constructor(user: User, accessToken: string, refreshToken: string) {
    this.user = plainToClass<ClientUserDTO, User>(ClientUserDTO, user, {
      excludeExtraneousValues: true,
    });
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

@ApiTags('auth')
@Controller({ path: 'auth' })
export default class AuthController {
  constructor(private readonly authMaintainer: AuthMaintainer) {}

  @Post('guest')
  @ApiOperation({ summary: 'Guest auth' })
  @ApiOkResponse({
    description: 'User updated',
    type: AuthResponse,
  })
  @ApiCreatedResponse({
    description: 'User created',
    type: AuthResponse,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: ValidationErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
    type: ServerErrorResponse,
  })
  @ApiConsumes('application/json')
  public authGuest(
    @Body(ValidationPipe) guestUserDTO: GuestUserDTO,
    @Request() req: express.Request,
    @Response() res: express.Response,
  ): Promise<express.Response> {
    return this.authMaintainer
      .authGuest({ user: guestUserDTO })
      .then(
        ({
          user,
          accessToken,
          refreshToken,
        }: {
          user: User;
          accessToken: string;
          refreshToken: string;
        }) => {
          return res
            .status(HttpStatus.CREATED)
            .json(new AuthResponse(user, accessToken, refreshToken));
        },
      );
  }

  @Put('/refresh')
  @ApiOperation({ summary: 'Get new tokens' })
  @ApiConsumes('application/json')
  @ApiOkResponse({
    description: 'New tokens created',
    type: AuthUpdateTokensResponse,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: ValidationErrorResponse,
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
  public refresh(
    @Body(ValidationPipe) { refreshToken }: RefreshTokensDTO,
    @Response() res: express.Response,
  ) {
    return this.authMaintainer
      .refreshTokens({ refreshToken })
      .then(
        ({
          user,
          accessToken,
          refreshToken,
        }: {
          user: User;
          accessToken: string;
          refreshToken: string;
        }) => {
          return res.json(new AuthResponse(user, accessToken, refreshToken));
        },
      );
  }
}
