import { Suspense, useContext } from 'react';
import { Outlet, useRouteError } from 'react-router-dom';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import HidePreloader from '@/core/HidePreloader';
import ShellRoutingSync from '@/core/ShellRoutingSync';

export default function Layout() {
  return (
    <div className="application">
      <Suspense>
        <ShellRoutingSync />
        <>
          <HidePreloader />
          <Outlet />
        </>
      </Suspense>
    </div>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError() as Error;
  const { navigation } = useContext(ShellContext).shell;

  const redirectionApplication = 'hub';

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
          data: { message: error.message },
          headers: {},
        }}
      />
      <ShellRoutingSync />
      <HidePreloader />
    </Suspense>
  );
};
