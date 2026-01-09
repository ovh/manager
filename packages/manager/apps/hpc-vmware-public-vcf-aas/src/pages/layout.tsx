import React, { useEffect, useContext } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { subRoutes, urls } from '@/routes/routes.constant';

export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.hpc-vmware-public-vcf-aas-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    const { hash } = window.location;
    // This is a hard fix TODO find a better solution
    // Detect duplicated public-vcf-aas
    const duplicated = `${subRoutes.root}/${subRoutes.root}`;
    if (hash.includes(duplicated)) {
      const fixedHash = hash.replace(duplicated, subRoutes.root);
      window.location.replace(
        `${window.location.origin}${window.location.pathname}${fixedHash}`,
      );
      return;
    }
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return <Outlet />;
}
