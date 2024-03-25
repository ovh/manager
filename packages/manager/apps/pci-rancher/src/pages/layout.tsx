import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import React, { useContext, useEffect } from 'react';
import { Outlet, useLocation, useMatches } from 'react-router-dom';

interface MatchHandle {
  tracking?: {
    pageName?: string;
  };
}

interface Match {
  handle?: MatchHandle;
}

function RoutingSynchronisation() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);

  const matches = useMatches();

  useEffect(() => {
    const [match] = matches.slice(-1) as Match[];
    //  We cannot type properly useMatches cause it's not support type inference or passing specific type https://github.com/remix-run/react-router/discussions/10902
    defineCurrentPage(`app.pci-rancher.${match?.handle?.tracking?.pageName}`);
  }, [location]);

  useEffect(() => {
    // Need to also hide the preloader here due to firefox still display it when cache is disabled
    // Need to investigate why preloader is not hidden
    shell.ux.hidePreloader();
  }, []);

  useEffect(() => {
    shell.routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    shell.routing.onHashChange();
  }, [location]);
  return <></>;
}

export default function Layout() {
  return (
    <>
      <RoutingSynchronisation />
      <Outlet />
    </>
  );
}
