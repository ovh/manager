import React, { useContext, useEffect } from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ErrorProps } from '@ovh-ux/muk';

import { Error } from '@/components';
import { usePlatform } from '@/data/hooks';
import { isPlatformLessPathname } from '@/utils';

export const Layout = () => {
  const location = useLocation();
  const { trackCurrentPage } = useOvhTracking();
  const { shell } = useContext(ShellContext);

  const { platformId, data: platform, isLoading, isError, error } = usePlatform();

  useEffect(() => {
    trackCurrentPage();
    shell.routing.onHashChange();
  }, [location.pathname, location.search]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  const isOnboardingRoute = location.pathname.startsWith('/onboarding');

  const isOnboardingNeeded =
    platform?.currentState?.numberOfOrganizations === 0 && !isOnboardingRoute;

  if (isError) {
    return <Error error={error as ErrorProps['error']} />;
  }

  if (!isLoading) {
    // 1. No platformId → go to onboarding
    if (!platformId && !isOnboardingRoute) {
      return <Navigate to="onboarding" replace />;
    }

    // 2. Needs onboarding → go to welcome
    if (isOnboardingNeeded) {
      return <Navigate to="onboarding/welcome" replace />;
    }

    // 3. Root path, or platform less deep link coming from an app that does not know about
    //    the platform entity (e.g. /services) → prefix the path with the resolved platformId
    const isRootPath = location.pathname === '/';

    if (isRootPath || isPlatformLessPathname(location.pathname)) {
      const pathname = isRootPath ? '' : location.pathname;

      return <Navigate to={`/${platformId}${pathname}${location.search}`} replace />;
    }
  }

  return <Outlet />;
};

export default Layout;
