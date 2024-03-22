import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useRouting, useShell } from '@ovh-ux/manager-react-shell-client';
import { OvhTracking } from '@ovh-ux/manager-react-core-application';

export default function Layout() {
  const shell = useShell();
  const location = useLocation();
  const routing = useRouting();

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    routing.onHashChange();
  }, [location]);

  return (
    <>
      <Outlet />
      <OvhTracking shell={shell} />
    </>
  );
}
