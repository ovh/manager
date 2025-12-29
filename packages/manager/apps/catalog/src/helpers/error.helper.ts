import { ErrorMessage, ErrorObject } from '@ovh-ux/muk';

import { ApiError } from '@ovh-ux/manager-core-api';
import { AxiosError } from 'axios';

const isAxiosError = (
  error: AxiosError | ErrorMessage,
): error is AxiosError => {
  return typeof error === 'object'
    ? typeof (error as AxiosError)?.response !== undefined
    : false;
};

export const formatError = (
  error: AxiosError<ApiError> | ErrorMessage,
): ErrorObject => {
  if (isAxiosError(error)) {
    return {
      data: {
        message: error?.response?.data?.message || error?.message,
      },
      headers: { 'x-ovh-queryid': error?.response?.headers?.['x-ovh-queryid'] },
    };
  }
  return error;
};
