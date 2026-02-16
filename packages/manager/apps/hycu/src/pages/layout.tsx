import React, { useEffect, useContext } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches } from '@tanstack/react-router';
import {
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { useOvhTracking } from '@/hooks/tracking/useOvhTracking';

export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();

  // TanStack Router replacement for manager-react-shell-client's `useRouteSynchro`
  // (which is hard-wired to react-router-dom hooks).
  useEffect(() => {
    shell?.routing?.stopListenForHashChange();
  }, []);

  useEffect(() => {
    shell?.routing?.onHashChange();
  }, [location]);

  useEffect(() => {
    const lastMatch = matches[matches.length - 1];
    defineCurrentPage(`app.hycu-${lastMatch?.routeId}`);
  }, [location]);

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return <Outlet />;
}
