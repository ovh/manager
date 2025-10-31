import { Suspense, useContext } from 'react';
import { useRouteError } from 'react-router-dom';
import { Error } from '@ovh-ux/muk';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useHidePreloader } from '@/hooks/useHidePreloader';
import { useShellRoutingSync } from '@/hooks/useShellRoutingSync';
import { mapUnknownErrorToBannerError } from '@/utils/error.utils';
import { redirectionApp } from '@/routes/Routes.constants';

/**
 * ErrorBoundary component for route errors
 * Uses MUK Error component with PCI project patterns
 * Handles route errors from React Router
 */
export const ErrorBoundary = () => {
  useHidePreloader();
  useShellRoutingSync();
  const error = useRouteError();
  const { navigation } = useContext(ShellContext).shell;
  const errorBannerError = mapUnknownErrorToBannerError(error);

  const navigateToHomePage = () => {
    navigation.navigateTo(redirectionApp, '', {});
  };

  const reloadPage = () => {
    navigation.reload();
  };

  return (
    <Suspense>
      <Error
        onReloadPage={reloadPage}
        onRedirectHome={navigateToHomePage}
        error={errorBannerError}
      />
    </Suspense>
  );
};

export default ErrorBoundary;
