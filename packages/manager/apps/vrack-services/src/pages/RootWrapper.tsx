import React from 'react';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { useInfiniteAuthorizationsIam } from '@ovhcloud/manager-components/src/hooks/iam';
import { useVrackServicesList } from '@/utils/vs-utils';
import { ErrorPage } from '@/components/Error';

import iamConfig from '@/api/iam/iam.config';

export default function RootWrapper() {
  const { isError, error } = useVrackServicesList();
  const location = useLocation();
  const { trackCurrentPage } = useOvhTracking();

  const { data: vracks } = useVrackServicesList();
  const matches: any = useMatches();
  const [actions, setActions] = React.useState([]);
  const [page, setPage] = React.useState('');
  const [urns, setUrns] = React.useState([]);
  const {
    authorizedActions,
    previousPageIndices,
    fetchNextPage,
  } = useInfiniteAuthorizationsIam({
    urns,
    actions,
    isTrigger: true,
    pageIndex: page,
  });

  useRouteSynchro();

  React.useEffect(() => {
    trackCurrentPage();
    const currentPage = (matches[matches.length - 1]?.handle as any)
      ?.currentPage;
    if (currentPage) {
      defineCurrentPage(currentPage);
    }
  }, [location.pathname, location.hash]);

  React.useEffect(() => {
    const urnsMapped = vracks?.data.map((element: any) => element.iam.urn);
    setUrns(urnsMapped);
  }, [vracks]);

  React.useEffect(() => {
    if (
      previousPageIndices.length > 0 &&
      previousPageIndices.indexOf(page) === -1 &&
      actions &&
      actions.length > 0
    )
      fetchNextPage();
  }, [matches, actions]);

  React.useEffect(() => {
    const { currentPage } = matches[matches.length - 1].handle;
    const actionsPage = currentPage ? iamConfig?.actions?.[currentPage] : [];
    setPage(currentPage);
    setActions(actionsPage);
  }, [matches]);

  return (
    <React.Suspense>
      {isError ? <ErrorPage error={error} /> : <Outlet />}
    </React.Suspense>
  );
}
