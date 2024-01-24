import apiClient from '@ovh-ux/manager-core-api';
import { ResponseData } from './api.type';

export type CreateFetchDataFnParams = {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  apiVersion: keyof typeof apiClient;
  params?: any;
  catchError?: boolean;
};

export const createFetchDataFn = <T>({
  params,
  apiVersion,
  method,
  url,
  catchError,
}: CreateFetchDataFnParams) => async () => {
  const response: ResponseData<T> = await apiClient[apiVersion][method](
    url,
    params,
  );

  if (response?.code?.startsWith('ERR') && !catchError) {
    throw new Error(response.response?.data.message);
  }

  return response;
};
