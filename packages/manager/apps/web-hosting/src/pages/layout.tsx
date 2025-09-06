import React, { useContext, useEffect } from 'react';

import { Navigate, Outlet, useLocation, useMatches } from 'react-router-dom';

import { ShellContext, useOvhTracking, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';

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
  }, [location, matches, trackCurrentPage]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, [shell.ux]);

  return (
    <>
      <Outlet />
      {data?.length === 0 && <Navigate key={location.pathname} to="/onboarding" replace />}
      {data?.length > 0 && location.pathname === '/' && location.search === '' && (
        <Navigate to="/websites" />
      )}
    </>
  );
}
