import React, { useContext, useEffect } from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ErrorBannerProps } from '@ovh-ux/manager-react-components';
import { ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { Error } from '@/components';
import { usePlatform } from '@/data/hooks';

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

  const isOnboardingNeeded =
    platform?.currentState?.numberOfOrganizations === 0 &&
    !location.pathname.startsWith('/onboarding');

  if (isError) {
    return <Error error={error as ErrorBannerProps['error']} />;
  }

  if (!isLoading) {
    // 1. No platformId → go to onboarding
    if (!platformId) {
      return <Navigate to="onboarding" replace />;
    }

    // 2. Needs onboarding → go to welcome
    if (isOnboardingNeeded) {
      return <Navigate to="onboarding/welcome" replace />;
    }

    // 3. Root path → redirect to platformId
    if (location.pathname === '/') {
      return <Navigate to={platformId} replace />;
    }
  }

  return <Outlet />;
};

export default Layout;
