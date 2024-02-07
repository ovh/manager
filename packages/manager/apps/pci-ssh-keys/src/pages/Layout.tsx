import { Outlet, useParams, useRouteError } from 'react-router-dom';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { Suspense } from 'react';
import { ErrorBanner } from '@ovhcloud/manager-components';

import BreadCrumbs from '@/components/BreadCrumbs';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import HidePreloader from '@/core/HidePreloader';
import useProject, { ResponseAPIError } from '@/hooks/useProject';

export default function Layout() {
  const { projectId } = useParams();
  const { error, isSuccess } = useProject(projectId || '', { retry: false });

  if (error) {
    error.message = `Project ${projectId} doesn't exists`;
    throw error;
  }
  return (
    <div className="application">
      <Suspense>
        <BreadCrumbs />
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
          data: { message: error.message },
          headers: error.response?.headers,
        }}
      />
      <ShellRoutingSync />
      <HidePreloader />
    </Suspense>
  );
};
