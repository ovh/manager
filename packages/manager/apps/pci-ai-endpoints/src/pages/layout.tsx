import React, { Suspense, useContext } from 'react';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { Outlet, useRouteError } from 'react-router-dom';
import { ResponseAPIError, useProject } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import HidePreloader from '@/core/HidePreloader';
import ShellRoutingSync from '@/core/ShellRoutingSync';
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
  const error = useRouteError() as ResponseAPIError;
  const { navigation } = useContext(ShellContext).shell;

  const redirectionApplication = 'public-cloud';

  const navigateToHomePage = () => {
    navigation.navigateTo(redirectionApplication, '', {});
  };

  const reloadPage = () => {
    navigation.reload();
  };

  return (
    <Suspense>
      <ErrorBanner
        onReloadPage={reloadPage}
        onRedirectHome={navigateToHomePage}
        error={{
          data: { message: error.response?.data?.message || error.message },
          headers: error.response?.headers || {},
        }}
      />
      <ShellRoutingSync />
      <HidePreloader />
    </Suspense>
  );
};
