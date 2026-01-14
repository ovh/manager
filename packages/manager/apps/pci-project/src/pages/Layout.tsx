import { Suspense, useContext, useEffect } from 'react';

import { Outlet, useLocation, useMatches } from 'react-router-dom';

import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext, useOvhTracking, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';

import { useTrackingAdditionalData } from '@/hooks/useTracking';

export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();

  const { trackCurrentPage } = useOvhTracking();
  const trackingAdditionalData = useTrackingAdditionalData();

  const { clearNotifications } = useNotifications();

  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.pci-project-${match[0]?.id}`);
  }, [location, matches]);

  useEffect(() => {
    trackCurrentPage({
      ...trackingAdditionalData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, [shell.ux]);

  useEffect(() => {
    clearNotifications();
  }, [location.pathname, clearNotifications]);

  return (
    <Suspense>
      <Outlet />
    </Suspense>
  );
}
