import React, { useEffect, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import '@ovhcloud/ods-theme-blue-jeans';

export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return <Outlet />;
}
