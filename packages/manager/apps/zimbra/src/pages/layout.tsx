import React, { useContext, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import {
  useOvhTracking,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import ErrorBanner from '@/components/Error/Error';
import { useOrganizations, usePlatform } from '@/hooks';
import { isOnboarded } from '@/utils';

export default function Layout() {
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
    !onboarded &&
    organizations?.length === 0 &&
    !location.pathname.startsWith('/onboarding');

  return (
    <>
      <Outlet />
      {isError && <ErrorBanner error={error} />}
      {!platformId && !isLoading && (
        <Navigate key={location.pathname} to="onboarding" replace={true} />
      )}
      {shouldOnboard && (
        <Navigate
          key={location.pathname}
          to="onboarding/welcome"
          replace={true}
        />
      )}
      {!shouldOnboard && location.pathname === '/' && (
        <Navigate to={platformId} replace={true} />
      )}
    </>
  );
}
