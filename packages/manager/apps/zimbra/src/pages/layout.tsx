import React, { useContext, useEffect } from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ErrorProps } from '@ovh-ux/muk';

import { Error } from '@/components';
import { useOrganizations, usePlatform } from '@/data/hooks';
import { isOnboarded } from '@/utils';

export const Layout = () => {
  const location = useLocation();
  const { trackCurrentPage } = useOvhTracking();
  const { shell } = useContext(ShellContext);

  const { platformId, isLoading, isError, error } = usePlatform();

  const onboarded = isOnboarded();

  const { data: organizations } = useOrganizations();

  useEffect(() => {
    trackCurrentPage();
    shell.routing.onHashChange();
  }, [location.pathname, location.search]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  const shouldOnboard =
    !onboarded && organizations?.length === 0 && !location.pathname.startsWith('/onboarding');

  return (
    <>
      <Outlet />
      {isError && <Error error={error as ErrorProps['error']} />}
      {!platformId && !isLoading && (
        <Navigate key={location.pathname} to="onboarding" replace={true} />
      )}
      {shouldOnboard && <Navigate key={location.pathname} to="onboarding/welcome" replace={true} />}
      {!shouldOnboard && location.pathname === '/' && <Navigate to={platformId} replace={true} />}
    </>
  );
};

export default Layout;
