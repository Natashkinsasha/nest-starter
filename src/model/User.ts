import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsInt, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export default class User {
  @ApiProperty({ type: ObjectId })
  @Expose()
  public readonly _id: ObjectId;
  @ApiProperty()
  @IsString({
    each: true,
  })
  @Expose()
  public readonly roles: ReadonlyArray<string>;
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @Expose()
  public readonly createdAt: Date;
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @Expose()
  public readonly lastUpdatedAt: Date;
  @ApiProperty()
  @IsInt()
  @Expose()
  public readonly version: number;
}
