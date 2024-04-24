import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { getZimbraPlatformList } from '@/api';
import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import { ZimbraPlatform } from '@/api/api.type';

export default function Layout() {
  const { data, isLoading, isError, error } = useQuery<ZimbraPlatform[], Error>(
    {
      queryKey: ['get/zimbra/platform'],
      queryFn: () => getZimbraPlatformList(),
    },
  );
  return (
    <>
      <Outlet />
      {isLoading && <Loading />}
      {isError && <ErrorBanner error={error} />}
      {data?.length === 0 && <Navigate to="onboarding" />}
      {data?.length > 0 && <Navigate to={`${data[0].id}`} />}
    </>
  );
}
