import React, { useContext, useEffect } from 'react';

import { Outlet, useLocation, useMatches } from 'react-router-dom';

import {
  ShellContext,
  useOvhTracking,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';

export default function Layout() {
  const [pathname, setPathname] = React.useState('');
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.ips-${match[0]?.id}`);
    setPathname(location?.pathname || '');
  }, [location]);

  useEffect(() => {
    if (pathname) {
      trackCurrentPage();
    }
  }, [pathname]);

  useEffect(() => {
    shell.ux.hidePreloader();

    setTimeout(() => {
      shell.ux.hidePreloader();
    }, 5000);
  }, [shell]);

  return <Outlet />;
}
