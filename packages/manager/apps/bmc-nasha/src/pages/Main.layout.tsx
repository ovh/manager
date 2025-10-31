import { Suspense, useEffect } from 'react';

import { Outlet, useLocation, useMatches } from 'react-router-dom';

import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';

import { appName } from '@/App.constants';
import { useHidePreloader } from '@/hooks/useHidePreloader';
import { useShellRoutingSync } from '@/hooks/useShellRoutingSync';

export default function MainLayout() {
  const location = useLocation();
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();

  // Hide shell preloader
  useHidePreloader();

  // Keep shell route state in sync with React Router
  useShellRoutingSync();

  // Tag the current page for request correlation
  useEffect(() => {
    const lastMatch = matches.at(-1); // most specific route
    if (lastMatch?.id) {
      defineCurrentPage(`app.${appName}-${lastMatch.id}`);
    }
  }, [matches]);

  // Track page views on route change
  useEffect(() => {
    trackCurrentPage();
  }, [trackCurrentPage, location.pathname]);

  return (
    <Suspense fallback={null /* Replace with loader if desired */}>
      <Outlet />
    </Suspense>
  );
}
