import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, Suspense } from 'react';
import { useRouteError } from 'react-router-dom';
import { mapUnknownErrorToBannerError } from '@/utils';
import { useShellRoutingSync } from '@/hooks/ShellRoutingSync/useShellRoutingSync';
import { useHidePreloader } from '@/hooks/hidePreloader/useHidePreloader';

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
