import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import {
  useRouteSynchro,
  useRouting,
} from '@ovh-ux/manager-react-shell-client';

import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import { usePlatform } from '@/hooks';

export default function Layout() {
  const location = useLocation();
  const routing = useRouting();

  const { platformId, isLoading, isError, error } = usePlatform();
  useEffect(() => {
    routing.onHashChange();
  }, [location]);

  useRouteSynchro();

  return (
    <>
      <Outlet />
      {isLoading && <Loading />}
      {isError && <ErrorBanner error={error} />}
      {!platformId && !isLoading && <Navigate to="onboarding" />}
      {platformId && location.pathname === '/' && location.search === '' && (
        <Navigate to={platformId} />
      )}
    </>
  );
}
