import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OvhTracking } from '@ovh-ux/manager-react-core-application';

export default function Layout() {
  const { shell } = React.useContext(ShellContext);
  const location = useLocation();

  useEffect(() => {
    shell.ux.hidePreloader();
    shell.routing.stopListenForHashChange();
  }, []);

  useEffect(() => {
    shell.routing.onHashChange();
  }, [location]);

  return (
    <>
      <Outlet />
      <OvhTracking shell={shell} environment={null} />
    </>
  );
}
