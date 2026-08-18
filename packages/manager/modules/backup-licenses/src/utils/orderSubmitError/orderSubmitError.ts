import { TApiCustomError } from '@ovh-ux/manager-core-api';

const SERVER_ERROR_STATUS = 500;

export const getOrderSubmitErrorMessage = (
  error: TApiCustomError | null | undefined,
  fallback: string,
): string => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  return message && status && status < SERVER_ERROR_STATUS ? message : fallback;
};
