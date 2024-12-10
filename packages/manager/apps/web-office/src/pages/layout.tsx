import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  useRouteSynchro,
  useRouting,
} from '@ovh-ux/manager-react-shell-client';
import { useOfficeLicenses } from '@/hooks';
import Loading from '@/components/Loading/Loading';

export default function Layout() {
  const location = useLocation();
  const routing = useRouting();

  const { data, isLoading } = useOfficeLicenses();

  useEffect(() => {
    routing.onHashChange();
  }, [location]);

  useRouteSynchro();

  return (
    <>
      <Outlet />
      {isLoading && <Loading />}
      {!data && !isLoading && <Navigate to="onboarding" />}
      {data && location.pathname === '/' && location.search === '' && (
        <Navigate to="/license" />
      )}
    </>
  );
}
