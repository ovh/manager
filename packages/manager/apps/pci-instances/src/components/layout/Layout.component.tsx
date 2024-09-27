import { Suspense, useContext, FC } from 'react';
import { useRouteError, Outlet } from 'react-router-dom';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { mapUnknownErrorToBannerError } from '@/utils';
import { useHidePreloader } from '@/hooks/hidePreloader/useHidePreloader';
import { useShellRoutingSync } from '@/hooks/shellRoutingSync/useShellRoutingSync';

const Layout: FC = () => {
  useHidePreloader();
  useShellRoutingSync();
  return (
    <div>
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
};

export const ErrorBoundary = () => {
  useHidePreloader();
  useShellRoutingSync();
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
    </Suspense>
  );
};

export default Layout;
