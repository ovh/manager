import { ApiError } from '@ovh-ux/manager-core-api';

export const getErrorMessage = (error: unknown) => {
  const apiError = error as ApiError;
  const message = apiError?.response?.data?.message || (apiError?.message ?? '');
  const ovhQueryId = apiError?.response?.headers?.['x-ovh-queryid'] as string;
  return ovhQueryId ? `${message} [x-ovh-queryid: ${ovhQueryId}]` : message;
};
