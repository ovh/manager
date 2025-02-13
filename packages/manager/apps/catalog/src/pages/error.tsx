import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import React, { Suspense, useContext } from 'react';

export default function ErrorPage() {
  const nav = useContext(ShellContext).shell.navigation;
  const redirectionApplication = 'catalog';

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
        error={{}}
      />
    </Suspense>
  );
}
