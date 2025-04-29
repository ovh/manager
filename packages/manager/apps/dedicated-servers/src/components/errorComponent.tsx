import React from 'react';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';

export type ErrorBannerProps = {
  status?: number;
  data?: any;
  headers?: Record<string, string>;
};

export type ErrorProps = { error: ApiError } | { error: ErrorBannerProps };

export const ErrorComponent = ({ error }: ErrorProps) => {
  let errorObj: ErrorBannerProps;
  if ('response' in error) {
    const { response }: any = error;
    errorObj = {
      data: error,
      headers: response?.headers,
      status: response?.status,
    };
  } else {
    errorObj = error;
  }
  return <ErrorBanner error={errorObj} />;
};
