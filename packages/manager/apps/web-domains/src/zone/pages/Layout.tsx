import  { useContext, useEffect } from 'react';

import {  Outlet, useLocation, useMatches,  } from 'react-router-dom';

import { ShellContext, useOvhTracking, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';


export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.web-domains/zone-${match[0]?.id}`);
    trackCurrentPage();
  }, [location, matches, trackCurrentPage]);


  useEffect(() => {
    shell.ux.hidePreloader();
  }, [shell.ux]);

  return (
    <> 
      <Outlet />
  </>
);
}
