import { isAxiosError } from 'axios';

import { ApiError } from '@ovh-ux/manager-core-api';

export const isApiErrorResponse = (error: unknown): error is ApiError =>
  isAxiosError<{ message: string }>(error) && !!error.response?.data.message;
