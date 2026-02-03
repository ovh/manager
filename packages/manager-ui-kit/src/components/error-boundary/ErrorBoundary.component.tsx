/* eslint-disable react/no-multi-comp */
import { useContext, useEffect } from 'react';

import { useRouteError } from 'react-router-dom';

import { ShellContext, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';

import {
  ErrorBoundaryProps,
  ResponseAPIError,
} from '@/components/error-boundary/ErrorBoundary.props';
import { Error } from '@/components/error/Error.component';

const ShellRoutingSync = () => {
  useRouteSynchro();
  return null;
};

export const ErrorBoundary = ({
  redirectionApp,
  isPreloaderHide = false,
  isRouteShellSync = false,
}: ErrorBoundaryProps) => {
  const error = useRouteError() as ResponseAPIError;

  const context = useContext(ShellContext);
  const { shell } = context;
  const navigateToHomePage = () => {
    shell?.navigation?.navigateTo(redirectionApp, '', {});
  };
  const errorObject =
    error && typeof error === 'object' && Object.keys(error)?.length > 0
      ? {
          data: {
            message: error?.response?.data?.message || error?.message,
          },
          headers: error?.response?.headers || {},
        }
      : {};

  const reloadPage = () => {
    if (shell && shell.navigation) {
      shell.navigation?.reload();
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (isPreloaderHide) {
      shell?.ux?.hidePreloader();
    }
  }, [isPreloaderHide, shell?.ux]);

  return (
    <>
      <Error onReloadPage={reloadPage} onRedirectHome={navigateToHomePage} error={errorObject} />
      {isRouteShellSync && <ShellRoutingSync />}
    </>
  );
};
