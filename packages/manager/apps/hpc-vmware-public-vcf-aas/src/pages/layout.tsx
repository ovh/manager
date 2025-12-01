import React, { useEffect, useContext } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';

export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.hpc-vmware-public-vcf-aas-${match[0]?.id}`);
  }, [location, matches]);

  useEffect(() => {
    trackCurrentPage();
  }, [location, trackCurrentPage]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, [shell.ux]);

  return <Outlet />;
}
