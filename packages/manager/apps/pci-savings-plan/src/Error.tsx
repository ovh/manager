import { ErrorBanner } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useRouteError } from 'react-router-dom';

export const Error = () => {
  const error = useRouteError();

  return (
    <ErrorBanner
      error={{
        status: 500,
        data: { message: (error as any)?.message },
      }}
    />
  );
};
