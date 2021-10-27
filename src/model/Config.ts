import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import EnvConfig from './EnvConfig';

export default class Config extends EnvConfig {
  @Expose()
  @IsString()
  public readonly PROJECT_NAME: string;
  @Expose()
  @IsString()
  public readonly NODE_ENV: string;
  @Expose()
  @IsNumber()
  public readonly MIN_RESPONSE_TIME: number;
  @Expose()
  @IsString()
  public readonly LOG_LEVEL: string;
  @Expose()
  @IsString()
  public readonly MONGO_URL: string;
  @Expose()
  @IsString()
  public readonly REDIS_URL: string;
  @Expose()
  @IsNumber()
  public readonly PORT: number;
  @Expose()
  @IsString()
  public readonly SECRET_KEY: string;
  @Expose()
  @IsString()
  public readonly ACCESS_TOKEN_LIFE_TIME: string;
  @Expose()
  @IsString()
  public readonly REFRESH_TOKEN_LIFE_TIME: string;
  @Expose()
  @IsString()
  public readonly TOKEN_HEADER: string;
}
