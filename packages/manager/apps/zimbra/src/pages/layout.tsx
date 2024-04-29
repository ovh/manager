import React, { useEffect, useContext } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches, Navigate } from 'react-router-dom';
import { ShellContext, useRouting } from '@ovh-ux/manager-react-shell-client';

import { useQuery } from '@tanstack/react-query';
import { getZimbraPlatform } from '@/api';
import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';

export default function Layout() {
  const location = useLocation();
  const routing = useRouting();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.zimbra-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);

  useEffect(() => {
    routing.onHashChange();
  }, [location]);

  const { data, isError, isLoading, error }: any = useQuery({
    queryKey: ['get/zimbra/platform'],
    queryFn: () => getZimbraPlatform(null), // The temp call to IAM api, because zimbra api isn't available
  });

  return (
    <>
      <Outlet />
      {isLoading && <Loading />}
      {isError && <ErrorBanner error={error} />}
      {data?.data?.length === 0 && <Navigate to="onboarding" />}
      {data?.data?.length > 0 && <Navigate to={`${data.data[0].id}`} />}
    </>
  );
}
