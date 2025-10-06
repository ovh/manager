import { Suspense, useContext } from 'react';

import { Outlet, useParams, useRouteError } from 'react-router-dom';

import { ApiError } from '@ovh-ux/manager-core-api';
import {
  PCICommonContext,
  usePCICommonContextFactory,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import HidePreloader from '@/core/HidePreloader';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import useHas3AZRegions from '@/hooks/useHas3AZRegions';
import usePageTracking from '@/hooks/usePageTracking';

export default function Layout() {
  const { projectId } = useParams();
  const { isSuccess } = useProject(projectId || '', { retry: false });
  usePageTracking();

  const { contains3AZ } = useHas3AZRegions();

  const pciCommonProperties = usePCICommonContextFactory({
    has3AZ: contains3AZ,
  });

  return (
    <div className="application">
      <Suspense>
        <ShellRoutingSync />
        {isSuccess && (
          <>
            <HidePreloader />
            <PCICommonContext.Provider value={pciCommonProperties}>
              <Outlet />
            </PCICommonContext.Provider>
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
        error={error.response}
      />
      <ShellRoutingSync />
      <HidePreloader />
    </Suspense>
  );
};
