import React, { useContext, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import {
  useOvhTracking,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import ErrorBanner from '@/components/Error/Error';
import { usePlatform } from '@/hooks';

export default function Layout() {
  const location = useLocation();
  const { trackCurrentPage } = useOvhTracking();
  const { shell } = useContext(ShellContext);

  const { platformId, isLoading, isError, error } = usePlatform();
  useEffect(() => {
    trackCurrentPage();
    shell.routing.onHashChange();
  }, [location.pathname]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <>
      <Outlet />
      {isError && <ErrorBanner error={error} />}
      {!platformId && !isLoading && (
        <Navigate key={location.pathname} to="onboarding" replace={true} />
      )}
      {platformId && location.pathname === '/' && location.search === '' && (
        <Navigate to={platformId} replace={true} />
      )}
    </>
  );
}
