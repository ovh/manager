import React from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import { appName } from '@/veeam-backup.config';

export default function Layout() {
  const location = useLocation();
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  React.useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.${appName}-${match[0]?.id}`);
    trackCurrentPage();
  }, [location]);

  return <Outlet />;
}
