import { ApiError } from '@ovh-ux/manager-core-api';
import { ErrorBannerProps } from '@ovh-ux/manager-react-components';
import { ErrorResponse, isRouteErrorResponse } from 'react-router-dom';
import { AxiosError, isAxiosError } from 'axios';

type RouterErrorResponse = Pick<
  ErrorResponse,
  'data' | 'status' | 'statusText'
> & {
  internal: boolean;
};

export const isApiErrorResponse = (error: unknown): error is ApiError =>
  isAxiosError(error) &&
  (error as AxiosError<{ message: string }>).response?.data?.message !==
    undefined;

export const mapUnknownErrorToBannerError = (
  error: unknown,
): ErrorBannerProps['error'] => {
  if (isApiErrorResponse(error) && error.response) {
    const { statusText, config, request, ...rest } = error.response;
    return rest;
  }
  if (isRouteErrorResponse(error)) {
    const {
      statusText,
      internal,
      ...rest
    } = (error as unknown) as RouterErrorResponse;
    return rest;
  }
  return {};
};
