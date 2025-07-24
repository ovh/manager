import { Outlet, useRouteError } from 'react-router-dom';

import {
  ShellContext,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import { Suspense, useContext } from 'react';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useProject } from '@ovh-ux/manager-pci-common';
import HidePreloader from '@/core/HidePreloader';

import usePageTracking from '@/hooks/usePageTracking';

export default function Layout() {
  const { isSuccess } = useProject();
  useRouteSynchro();
  usePageTracking();
  return (
    <div className="md:mx-11 mt-8">
      <Suspense>
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
