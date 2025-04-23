import React, { useEffect, useContext } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Navigate, Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { useGetAllDomServiceList } from '../hooks/data/query';
import Loading from '../components/Loading/Loading';

export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();
  const { data, isLoading } = useGetAllDomServiceList();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.web-domains-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <>
      <React.Suspense fallback={<Loading />}>
        <Outlet />
      </React.Suspense>
      {!data && !isLoading && (
        <Navigate key={location.pathname} to="onboarding" replace={true} />
      )}
    </>
  );
}
