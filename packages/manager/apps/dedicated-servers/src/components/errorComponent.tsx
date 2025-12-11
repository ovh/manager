import React from 'react';
import { Error } from '@ovh-ux/muk';
import { ApiError } from '@ovh-ux/manager-core-api';

export type ErrorBannerProps = {
  status?: number;
  data?: unknown;
  headers?: Record<string, string>;
};

export type ErrorProps = { error: ApiError } | { error: ErrorBannerProps };

export const ErrorComponent = ({ error }: ErrorProps) => {
  if ("response" in error) {
    const { status, headers } = error.response;

    return (
      <Error
        error={{
          status,
          data: error,
          headers: Object.fromEntries(
            Object.entries(headers ?? {}).map(([k, v]) => [k, String(v)])
          ),
        }}
      />
    );
  }

  return <Error error={error} />;
};