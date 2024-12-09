// Custom configuration used by Orval
import { AxiosRequestConfig } from 'axios';

import { v6, v2 } from '@ovh-ux/manager-core-api';

export const customInstanceV6 = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const promise = v6({
    ...config,
    ...options,
  }).then(({ data }) => data);

  return promise;
};

export const customInstanceV2 = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const promise = v2({
    ...config,
    ...options,
  }).then(({ data }) => data);

  return promise;
};
