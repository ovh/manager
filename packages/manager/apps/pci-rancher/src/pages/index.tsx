import { Outlet } from 'react-router-dom';
import { ErrorBanner, PageLayout } from '@ovhcloud/manager-components';
import React, { Suspense } from 'react';
import Loading from '@/components/Loading/Loading';
import { useRanchers } from '@/hooks/useRancher';
import Listing from './listing';

export default function Home() {
  const { data, isError, error, isLoading, refetch } = useRanchers({});

  if (isError && error) {
    return (
      <Suspense>
        <ErrorBanner error={error.response} />
      </Suspense>
    );
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Suspense fallback={<Loading />}>
      {data && <Listing data={data} refetchRanchers={refetch} />}
    </Suspense>
  );
}
