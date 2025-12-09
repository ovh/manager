import { useEffect } from 'react';

import { Outlet, useLocation, useMatches } from 'react-router-dom';

import { useOvhTracking, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';

import { useShellContext } from '@/common/hooks/useShellContext';

export default function Layout() {
  const location = useLocation();
  const { shell } = useShellContext();
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.key-management-service-${match[0]?.id}`);
  }, [location, matches]);

  useEffect(() => {
    trackCurrentPage();
  }, [location, trackCurrentPage]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, [shell.ux]);

  return <Outlet />;
}
