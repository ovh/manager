import { useRouteError } from 'react-router-dom';

import { ApiError } from '@ovh-ux/manager-core-api';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Suspense, useContext } from 'react';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import HidePreloader from '@/core/HidePreloader';

export const ErrorBoundary = () => {
  const error = useRouteError() as ApiError;
  const nav = useContext(ShellContext).shell.navigation;

  const redirectionApplication = 'public-cloud';

  const navigateToHomePage = () => {
    nav.navigateTo(redirectionApplication, '', {});
  };

  const reloadPage = () => {
    nav.reload();
  };

  return (
    <Suspense>
      <ErrorBanner
        onReloadPage={reloadPage}
        onRedirectHome={navigateToHomePage}
        error={error.response}
      />
      <ShellRoutingSync />
      <HidePreloader />
    </Suspense>
  );
};
