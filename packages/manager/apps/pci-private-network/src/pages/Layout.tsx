import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { Suspense, useContext, useEffect } from 'react';
import { Outlet, useLocation, useRouteError } from 'react-router-dom';
import { ResponseAPIError, useProject } from '@ovh-ux/manager-pci-common';
import {
  ShellContext,
  useOvhTracking,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import HidePreloader from '@/core/HidePreloader';
import ShellRoutingSync from '@/core/ShellRoutingSync';

export default function Layout() {
  const { isSuccess } = useProject();

  const location = useLocation();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

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
