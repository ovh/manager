import { Outlet, useRouteError } from 'react-router-dom';
import {
  ShellContext,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import { Suspense, useContext } from 'react';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import HidePreloader from '@/core/HidePreloader';

import usePageTracking from '@/hooks/usePageTracking';

export default function Layout() {
  useRouteSynchro();
  usePageTracking();

  return (
    <div className="application">
      <Suspense>
        <HidePreloader />
        <Outlet />
      </Suspense>
    </div>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError() as ApiError;
  const nav = useContext(ShellContext).shell.navigation;
  useRouteSynchro();

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
      <HidePreloader />
    </Suspense>
  );
};
