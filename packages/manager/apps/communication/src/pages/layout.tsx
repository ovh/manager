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
  const pageTracking = usePageTracking();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.communication-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    if (!pageTracking) return;
    const { pageName, pageType, subApp } = pageTracking;
    trackPage({
      pageName,
      pageType,
      subApp,
    });
  }, [location, pageTracking, trackPage]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <Suspense>
      <Outlet />
    </Suspense>
  );
}
