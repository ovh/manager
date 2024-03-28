import React from 'react';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import {
  useRouteSynchro,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useVrackServicesList } from '@/utils/vs-utils';
import { ErrorPage } from '@/components/Error';

export const RootWrapper = () => {
  const { isError, error } = useVrackServicesList();
  useRouteSynchro();
  const location = useLocation();
  const matches = useMatches();
  const { trackPage } = useOvhTracking();

  React.useEffect(() => {
    const nomemclature = matches.map((elem) => elem.id).join('::');
    const currentPage = matches.map((elem) => elem.id).join('.');
    // tracking
    trackPage({ path: nomemclature });
    // request tagger
    defineCurrentPage(currentPage);
  }, [location]);

  return (
    <React.Suspense>
      {isError ? <ErrorPage error={error} /> : <Outlet />}
    </React.Suspense>
  );
};

export default RootWrapper;
