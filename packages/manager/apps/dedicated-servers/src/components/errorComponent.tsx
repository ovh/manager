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
  return (
    <ErrorBanner
      error={'response' in error ? { ...error.response, data: error } : error}
    />
  );
};
