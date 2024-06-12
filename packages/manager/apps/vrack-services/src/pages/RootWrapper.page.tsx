import React from 'react';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { useVrackServicesList } from '@/data';
import { ErrorPage } from '@/components/ErrorPage.component';
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

    const currentPage = (matches[matches.length - 1]?.handle as Handle)
      ?.currentPage;
    if (currentPage) {
      defineCurrentPage(currentPage);
    }
  }, [location.pathname, location.hash]);

  return (
    <React.Suspense>
      {isError ? <ErrorPage error={error} /> : <Outlet />}
    </React.Suspense>
  );
}
