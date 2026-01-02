import { Suspense, useContext, useEffect } from 'react';

import { Outlet, useLocation, useMatches } from 'react-router-dom';

import { ShellContext, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';

import { APP_NAME } from '@/App.constants';

import { useOkmsTracking } from '../hooks/useOkmsTracking';

export default function MainLayout() {
  const location = useLocation();
  const matches = useMatches();
  const { shell } = useContext(ShellContext);
  const { trackCurrentPage } = useOkmsTracking();

  // Keep shell route state in sync with React Router
  useRouteSynchro();

  // Tag the current page for request correlation
  useEffect(() => {
    const lastMatch = matches.at(-1); // most specific route
    if (lastMatch?.id) {
      defineCurrentPage(`app.${APP_NAME}-${lastMatch.id}`);
    }
  }, [matches]);

  // Track page views on route change
  useEffect(() => {
    trackCurrentPage();
  }, [trackCurrentPage, location.pathname]);

  // Hide shell preloader on mount
  useEffect(() => {
    void shell?.ux.hidePreloader();
  }, [shell]);

  return (
    <Suspense fallback={null /* Replace with loader if desired */}>
      <Outlet />
    </Suspense>
  );
}
