import { Suspense, useContext, useEffect } from 'react';

import { Outlet, useLocation, useMatches } from 'react-router-dom';

import { ShellContext, useOvhTracking, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';

import { appName } from '@/App.constants';
import { BackupAgentContext } from "@ovh-ux/backup-agent/src/BackupAgent.context";

export default function MainLayout() {
  const location = useLocation();
  const matches = useMatches();
  const { shell } = useContext(ShellContext);
  const { trackCurrentPage } = useOvhTracking();

  // Keep shell route state in sync with React Router
  useRouteSynchro();

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

  // Hide shell preloader on mount
  useEffect(() => {
    void shell?.ux.hidePreloader();
  }, [shell]);

  return (
    <BackupAgentContext.Provider value={{ appName, scope: "Enterprise" }}>
      <Suspense fallback={null /* Replace with loader if desired */}>
        <Outlet />
      </Suspense>
    </BackupAgentContext.Provider>
  );
}
