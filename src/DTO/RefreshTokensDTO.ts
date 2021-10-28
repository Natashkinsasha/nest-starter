import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export default class RefreshTokensDTO {
  @ApiProperty()
  @IsString()
  @Expose()
  public refreshToken: string;
}
