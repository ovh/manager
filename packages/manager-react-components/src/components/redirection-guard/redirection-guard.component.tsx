import React from 'react';
import { Navigate } from 'react-router-dom';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

export type RedirectionGuardProps = {
  children: React.ReactNode;
  condition: boolean;
  isLoading: boolean;
  route: string;
};

export function RedirectionGuard({
  route,
  condition,
  isLoading,
  children,
}: RedirectionGuardProps): JSX.Element {
  if (isLoading) {
    return (
      <OdsSpinner
        data-testid="redirectionGuard_spinner"
        size={ODS_SPINNER_SIZE.md}
      />
    );
  }

  return condition ? <Navigate to={route} /> : <>{children}</>;
}
