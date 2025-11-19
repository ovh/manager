import React, { useEffect, useContext } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';

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
  }, []);

  return <Outlet />;
}
