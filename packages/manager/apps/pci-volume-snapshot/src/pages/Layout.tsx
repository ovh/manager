import { Outlet, useRouteError } from 'react-router-dom';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Suspense, useContext } from 'react';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useProject } from '@ovh-ux/manager-pci-common';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import HidePreloader from '@/core/HidePreloader';

import usePageTracking from '@/hooks/usePageTracking';

export default function Layout() {
  const { isSuccess } = useProject();
  usePageTracking();
  return (
    <div className="application">
      <Suspense>
        <ShellRoutingSync />
        {isSuccess && (
          <>
            <HidePreloader />
            <Outlet />
          </>
        )}
      </Suspense>
    </div>
  );
}

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
        error={error?.response || error}
      />
      <ShellRoutingSync />
      <HidePreloader />
    </Suspense>
  );
};
