import React, { useEffect } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import { useShellContext } from '@/common/hooks/useShellContext';

export default function Layout() {
  const location = useLocation();
  const { shell } = useShellContext();
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.key-management-service-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return <Outlet />;
}
