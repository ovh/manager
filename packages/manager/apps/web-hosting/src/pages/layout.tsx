import React, { useEffect, useContext } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Navigate, Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { useWebHostingAttachedDomain } from '@/data/hooks/webHostingAttachedDomain/useWebHostingAttachedDomain';

export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  const { data } = useWebHostingAttachedDomain();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.web-hosting-${match[0]?.id}`);
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <>
      <Outlet />
      {data?.length === 0 && (
        <Navigate key={location.pathname} to="/onboarding" replace />
      )}
      {data?.length > 0 &&
        location.pathname === '/' &&
        location.search === '' && <Navigate to="/websites" />}
    </>
  );
}
