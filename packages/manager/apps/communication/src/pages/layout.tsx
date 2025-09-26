import React, { useEffect, useContext, Suspense } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { usePageTracking, useTracking } from '@/hooks/useTracking/useTracking';

export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackPage } = useTracking();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.communication-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    const tracking = usePageTracking();
    if (!tracking) return;
    const { pageName, pageType, subApp } = tracking;
    trackPage({
      pageName,
      pageType,
      subApp,
    });
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
