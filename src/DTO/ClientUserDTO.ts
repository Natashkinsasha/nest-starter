import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export default class ClientUserDTO {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj?._id?.toHexString())
  public id: string;
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @Expose()
  public readonly createdAt: Date;
  @ApiProperty()
  @IsString({
    each: true,
  })
  @Expose()
  public readonly roles: ReadonlyArray<string>;
}
