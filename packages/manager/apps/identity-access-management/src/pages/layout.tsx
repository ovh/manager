import React, { useEffect, useContext, Suspense } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';

export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.identity-access-management-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <Suspense>
      <Outlet />
    </Suspense>
  );
}
