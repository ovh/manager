import React, { useContext, useEffect } from 'react';

import { Outlet, useLocation, useMatches } from 'react-router-dom';

import '@ovhcloud/ods-theme-blue-jeans';

import { ShellContext, useOvhTracking, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';

interface MatchHandle {
  tracking?: {
    pageName?: string;
  };
}

interface Match {
  handle?: MatchHandle;
}

export default function Layout() {
  const location = useLocation();
  const { trackCurrentPage } = useOvhTracking();
  const matches = useMatches();
  const { shell } = useContext(ShellContext);
  useRouteSynchro();

  useEffect(() => {
    shell.ux.hidePreloader();
    shell.ux.stopProgress();
  }, []);

  useEffect(() => {
    trackCurrentPage();
    const [match] = matches.slice(-1) as Match[];
    defineCurrentPage(`app.hub-${match?.handle?.tracking?.pageName}`);
  }, [location]);

  return <Outlet />;
}
