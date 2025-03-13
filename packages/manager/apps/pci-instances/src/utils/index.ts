import { ErrorBannerProps } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ErrorResponse, isRouteErrorResponse } from 'react-router-dom';
import { AxiosError } from 'axios';

type RouterErrorResponse = Pick<
  ErrorResponse,
  'data' | 'status' | 'statusText'
> & {
  internal: boolean;
};

export const isApiErrorResponse = (error: unknown): error is ApiError =>
  error instanceof AxiosError &&
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

export const instancesQueryKey = (
  projectId: string,
  rest?: string[],
): string[] => [
  'project',
  projectId,
  'instances',
  ...(rest && rest.length > 0 ? rest : []),
];

export const kebabToSnakeCase = (str: string): string => str.replace(/-/g, '_');

export const formatUUID = (uuid: string): string | null => {
  if (!/^[a-fA-F0-9]{32}$/.test(uuid)) {
    return null;
  }

  return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(
    12,
    16,
  )}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
};
