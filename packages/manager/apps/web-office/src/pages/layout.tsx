import { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  ShellContext,
  useOvhTracking,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { useLicenses } from '@/data/hooks';
import Loading from '@/components/loading/Loading.component';

export default function Layout() {
  const location = useLocation();
  const matches = useMatches();
  const { shell } = useContext(ShellContext);
  const { data, isLoading } = useLicenses();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.web-office-${match[0]?.id}`);
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    shell.routing.onHashChange();
  }, [location.pathname]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);
  return (
    <>
      <Outlet />
      {isLoading && <Loading />}
      {data?.length === 0 && !isLoading && (
        <Navigate key={location.pathname} to="/onboarding" replace />
      )}
      {data?.length > 0 &&
        location.pathname === '/' &&
        location.search === '' && <Navigate to="/license" />}
    </>
  );
}
