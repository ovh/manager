import React, { useEffect, useContext } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Navigate, Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { TDomainResource } from '@/domain/types/domainResource';

export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();
  const { data, isLoading, isFetched } = useResourcesIcebergV2<TDomainResource>(
    {
      route: '/domain/name',
      queryKey: ['/domain/name'],
      pageSize: 10,
    },
  );
  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.web-domains-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <>
      <Outlet />
      {isFetched && !data && !isLoading && (
        <Navigate key={location.pathname} to="onboarding" replace={true} />
      )}
    </>
  );
}
