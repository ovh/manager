import { useContext } from 'react';
import { ErrorBanner } from '../error/error.component';
import { useRouteError } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

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

export const ErrorBoundary = ({
  redirectionApp,
}: {
  redirectionApp: string;
}) => {
  const error = useRouteError() as ResponseAPIError;
  const shell = useContext(ShellContext)?.shell;

  const navigateToHomePage = () => {
    shell?.navigation.navigateTo(redirectionApp, '', {});
  };

  const reloadPage = () => {
    shell?.navigation.reload();
  };

  return (
    <ErrorBanner
      onReloadPage={reloadPage}
      onRedirectHome={navigateToHomePage}
      error={{
        data: { message: error?.response?.data?.message || error?.message },
        headers: error?.response?.headers || {},
      }}
    />
  );
};
