import { isAxiosError } from 'axios';

import { ApiError } from '@ovh-ux/manager-core-api';

export const isApiErrorResponse = (
  error: unknown,
): error is Omit<ApiError, 'response'> & { response: { data: { message: string } } } =>
  isAxiosError<{ message: string }>(error) && error.response?.data.message !== undefined;
