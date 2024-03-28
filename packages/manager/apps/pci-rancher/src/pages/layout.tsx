import React, { useEffect } from 'react';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { useRouting, useShell } from '@ovh-ux/manager-react-shell-client';

function RoutingSynchronisation() {
  const location = useLocation();
  const routing = useRouting();

  const shell = useShell();
  const matches = useMatches();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(match[0]?.id);
  }, [location]);

  useEffect(() => {
    // Need to also hide the preloader here due to firefox still display it when cache is disabled
    // Need to investigate why preloader is not hidden
    shell.ux.hidePreloader();
  }, []);

  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    routing.onHashChange();
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
