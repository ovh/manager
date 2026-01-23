import React from 'react';

import { Outlet, useLocation, useMatches } from 'react-router-dom';

import { useVrackServicesList } from '@ovh-ux/manager-network-common';
import { PageType, useOvhTracking, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import { Error } from '@ovh-ux/muk';
import { defineCurrentPage } from '@ovh-ux/request-tagger';

import { PageName } from '@/utils/tracking';

type Handle = {
  tracking?: { pageType: PageType; pageName: PageName };
  currentPage?: string;
};

export default function RootWrapper() {
  const { isError, error } = useVrackServicesList();
  const location = useLocation();
  const { trackCurrentPage } = useOvhTracking();
  const matches = useMatches();
  useRouteSynchro();

  React.useEffect(() => {
    trackCurrentPage();

    const currentPage = (matches[matches.length - 1]?.handle as Handle)?.currentPage;
    if (currentPage) {
      defineCurrentPage(currentPage);
    }
  }, [location.pathname, location.hash, trackCurrentPage, matches]);

  return <React.Suspense>{isError ? <Error error={error} /> : <Outlet />}</React.Suspense>;
}
