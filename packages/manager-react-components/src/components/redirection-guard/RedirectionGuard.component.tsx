import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner, SPINNER_SIZE } from '@ovhcloud/ods-react';
import { RedirectionGuardProps } from './RedirectionGuard.props';

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
      <Spinner data-testid="redirectionGuard_spinner" size={SPINNER_SIZE.md} />
    );
  }

  if (isError && errorComponent) {
    return <>{errorComponent}</>;
  }

  return condition ? <Navigate to={route} /> : <>{children}</>;
}
