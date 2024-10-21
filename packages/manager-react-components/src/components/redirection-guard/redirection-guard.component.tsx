import React from 'react';
import { Navigate } from 'react-router-dom';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

export type RedirectionGuardProps = {
  children: React.ReactNode;
  condition: boolean;
  isLoading: boolean;
  route: string;
  isError?: boolean;
  errorComponent?: React.ReactNode;
};

export function RedirectionGuard({
  route,
  condition,
  isLoading,
  children,
  isError,
  errorComponent,
}: RedirectionGuardProps): JSX.Element {
  if (isLoading) {
    return (
      <OsdsSpinner
        data-testid="redirectionGuard_spinner"
        size={ODS_SPINNER_SIZE.md}
        inline
      />
    );
  }

  if (isError && errorComponent) {
    return <>{errorComponent}</>;
  }

  return condition ? <Navigate to={route} /> : <>{children}</>;
}
