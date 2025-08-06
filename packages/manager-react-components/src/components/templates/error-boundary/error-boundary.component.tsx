import { useContext, useEffect } from 'react';
import { Error } from '../../error/Error.component';
import { useRouteError } from 'react-router-dom';
import {
  ShellContext,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';

export interface ResponseAPIError {
  message: string;
  stack: string;
  name: string;
  code: string;
  response?: {
    headers?: {
      [key: string]: string;
      'x-ovh-queryid': string;
    };
    data?: {
      message?: string;
    };
  };
}

const ShellRoutingSync = () => {
  useRouteSynchro();
  return null;
};

export interface ErrorBoundaryProps {
  /** application name to redirect */
  redirectionApp: string;
  /** Trigger the preloader hiding */
  isPreloaderHide?: boolean;
  /** Trigger the routes sync beetween shell and the app */
  isRouteShellSync?: boolean;
}

export const ErrorBoundary = ({
  redirectionApp,
  isPreloaderHide = false,
  isRouteShellSync = false,
}: ErrorBoundaryProps) => {
  const error = useRouteError() as ResponseAPIError;
  const shell = useContext(ShellContext)?.shell;

  const navigateToHomePage = () => {
    shell?.navigation.navigateTo(redirectionApp, '', {});
  };

  const reloadPage = () => {
    shell?.navigation.reload();
  };

  useEffect(() => {
    if (isPreloaderHide) {
      shell?.ux.hidePreloader();
    }
  }, [isPreloaderHide]);

  return (
    <>
      <Error
        onReloadPage={reloadPage}
        onRedirectHome={navigateToHomePage}
        error={{
          data: { message: error?.response?.data?.message || error?.message },
          headers: error?.response?.headers || {},
        }}
      />
      {isRouteShellSync && <ShellRoutingSync />}
    </>
  );
};
