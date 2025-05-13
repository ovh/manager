import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useLicenses } from '@/data/hooks';
import Loading from '@/components/loading/Loading.component';

export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const { data, isLoading } = useLicenses();

  useEffect(() => {
    shell.routing.onHashChange();
  }, [location.pathname]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);
  return (
    <>
      <Outlet />
      {isLoading && <Loading />}
      {data?.length === 0 && !isLoading && (
        <Navigate key={location.pathname} to="/onboarding" replace />
      )}
      {data?.length > 0 &&
        location.pathname === '/' &&
        location.search === '' && <Navigate to="/license" />}
    </>
  );
}
