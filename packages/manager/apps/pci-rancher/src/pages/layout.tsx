import React, { useContext, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function RoutingSynchronisation() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);

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
