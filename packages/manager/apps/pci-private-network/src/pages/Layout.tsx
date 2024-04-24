import { Outlet, useParams, useRouteError } from 'react-router-dom';

import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { ErrorBanner } from '@ovhcloud/manager-components';
import { Suspense } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import useProject from '@/api/hooks/useProject';
import HidePreloader from '@/core/HidePreloader';
import ShellRoutingSync from '@/core/ShellRoutingSync';

import usePageTracking from '@/hooks/usePageTracking';

export default function Layout() {
  const { projectId } = useParams();
  const { isSuccess } = useProject(projectId || '', { retry: false });
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
  const nav = useNavigation();

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
