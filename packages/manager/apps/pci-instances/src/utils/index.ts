import { ErrorBannerProps } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ErrorResponse, isRouteErrorResponse } from 'react-router-dom';
import { AxiosError, isAxiosError } from 'axios';
import { TFunction } from 'i18next';

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

export const instancesQueryKey = (
  projectId: string,
  rest?: string[],
): string[] => [
  'project',
  projectId,
  'instances',
  ...(rest && rest.length > 0 ? rest : []),
];

export const replaceToSnakeCase = (str: string): string =>
  str.replace(/[-/]/g, '_');

export const isCustomUrlSection = (str: string): boolean =>
  str.includes('-') || str.includes('/');

export const getPathMatch = <T extends string>(
  pathname: string,
  regex: RegExp,
): T | null => {
  const match = pathname.match(regex);
  return match ? (match[0] as T) : null;
};

export const safeTranslate = (key: string, t: TFunction) => {
  const translation = t(key);
  return translation === key ? '' : translation;
};
