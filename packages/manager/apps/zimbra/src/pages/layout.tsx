import React, { useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useRouting } from '@ovh-ux/manager-react-shell-client';
import { useQuery } from '@tanstack/react-query';
import { getiamPolicyList } from '@/api';
import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';

function RoutingSynchronisation() {
  const location = useLocation();
  const routing = useRouting();
  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    routing.onHashChange();
  }, [location]);
  return <></>;
}

export default function Layout() {
  const { data, isError, isLoading, error }: any = useQuery({
    queryKey: ['get/zimbra/platform'],
    queryFn: () => getiamPolicyList(null), // The temp call to IAM api, because zimbra api isn't available
  });

  return (
    <>
      <RoutingSynchronisation />
      <Outlet />
      {isLoading && <Loading />}
      {isError && <ErrorBanner error={error} />}
      {data?.data?.length === 0 && <Navigate to="/onboarding" />}
      {data?.data?.length > 0 && <Navigate to={`/${data.data[0].id}`} />}
    </>
  );
}
