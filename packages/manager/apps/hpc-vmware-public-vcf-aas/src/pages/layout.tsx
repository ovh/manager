import { useContext, useEffect } from 'react';

import { Outlet, useLocation, useMatches } from 'react-router-dom';

import { ShellContext, useOvhTracking, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';

import { subRoutes } from '@/routes/routes.constant';

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
    const { hash } = window.location;
    // This is a hard fix TODO find a better solution
    // Detect duplicated public-vcf-aas
    const duplicated = `${subRoutes.root}/${subRoutes.root}`;
    if (hash.includes(duplicated)) {
      const fixedHash = hash.replace(duplicated, subRoutes.root);
      window.location.replace(`${window.location.origin}${window.location.pathname}${fixedHash}`);
      return;
    }
    trackCurrentPage();
  }, [location, trackCurrentPage]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, [shell.ux]);

  return <Outlet />;
}
