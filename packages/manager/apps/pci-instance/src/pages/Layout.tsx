import { Suspense, useContext, FC } from 'react';
import { useRouteError, Outlet } from 'react-router-dom';
import { ErrorBanner } from '@ovhcloud/manager-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { mapUnknownErrorToBannerError } from '@/utils';
import HidePreloader from '@/components/hidePreloader/HidePreloader';
import ShellRoutingSync from '@/components/shell/ShellRoutingSync';

const Layout: FC<string> = () => (
  <div className="mx-11 mt-8">
    <Suspense>
      <ShellRoutingSync />
      <Outlet />
    </Suspense>
  </div>
);

export const ErrorBoundary = () => {
  const routerError = useRouteError();
  const errorBannerError = mapUnknownErrorToBannerError(routerError);

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
        error={errorBannerError}
      />
      <ShellRoutingSync />
      <HidePreloader />
    </Suspense>
  );
};

export default Layout;
