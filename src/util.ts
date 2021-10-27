import axios, { AxiosRequestConfig } from 'axios';

export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];

export function getLast<T>(array: Array<T> | ReadonlyArray<T>): T | undefined {
  return array[array.length - 1];
}

export function removeUndefinedFields<T extends { [key: string]: any }>(
  obj: T,
): T {
  // eslint-disable-next-line no-param-reassign
  Object.keys(obj).forEach(
    (key: string) => obj[key] === undefined && delete obj[key],
  );
  return obj;
}

export function tryParse<T>(json: string, def: T): T {
  try {
    const value = JSON.parse(json);
    if ({}.toString.call(value) === {}.toString.call(def)) {
      return value;
    }
    return def;
  } catch (e) {
    return def;
  }
}

export function cacheRequest(
  config: AxiosRequestConfig,
  key: string,
  expireTime?: number,
) {
  const CACHE_SERVICE_URL = 'https://cache.whitesharx.com/api/v1/cache';
  return axios.request({
    method: 'POST',
    url: CACHE_SERVICE_URL,
    headers: {
      'x-key': key,
      'x-expire-time': (expireTime || 60).toString(),
      'x-project': 'multiverse',
    },
    data: config,
  });
}
