import { useEffect, useContext } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Navigate, Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { TDomainResource } from '@/domain/types/domainResource';
import { useDataApi } from '@ovh-ux/muk';

export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  const { flattenData, isLoading, isSuccess } = useDataApi<TDomainResource>({
    version: 'v2',
    route: '/domain/name',
    cacheKey: ['/domain/name'],
    disableCache: true,
    defaultSorting: [{ id: 'id', desc: false }],
    iceberg: false,
    enabled: true,
    pageSize: 1,
  });
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
      {isSuccess && (!flattenData || flattenData?.length === 0) && (
        <Navigate key={location.pathname} to="onboarding" replace={true} />
      )}
    </>
  );
}
