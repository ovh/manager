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

/**
 * Reformats a non valid UUID string by inserting hyphens at the correct positions.
 *
 * @param uuid - A string representing a UUID without hyphens (32 hexadecimal characters).
 * @returns The formatted UUID with hyphens (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`), or `null` if the input is empty.
 *
 * @note This function does not validate whether the input is a valid UUID.
 *       It assumes a 32-character hexadecimal input.
 */
export const formatUUID = (uuid: string): string | null => {
  if (!uuid.length) return null;
  return uuid.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
};
