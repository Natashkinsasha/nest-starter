import { Expose } from 'class-transformer';

export default class EnvConfig {
  @Expose()
  public npm_package_name: string;
}
