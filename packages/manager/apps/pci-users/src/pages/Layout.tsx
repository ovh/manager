import { Outlet, useParams, useRouteError } from 'react-router-dom';

import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { Suspense } from 'react';
import BreadCrumbs from '@/components/BreadCrumbs';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import HidePreloader from '@/core/HidePreloader';
import useProject, { ResponseAPIError } from '@/hooks/useProject';

import ErrorPage from '@/components/error-page/ErrorPage';

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
  const error = useRouteError();
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
      <ErrorPage
        reloadPage={() => reloadPage()}
        navigateToHomepage={() => navigateToHomePage()}
        errorMessage={(error as ResponseAPIError)?.message || ''}
        xOvhQueryId={
          (error as ResponseAPIError)?.response?.headers?.['x-ovh-queryid'] ||
          ''
        }
      />
      <ShellRoutingSync />
      <HidePreloader />
    </Suspense>
  );
};
