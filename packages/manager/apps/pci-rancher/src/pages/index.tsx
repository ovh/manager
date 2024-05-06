import { Outlet } from 'react-router-dom';
import { ErrorBanner, PageLayout } from '@ovhcloud/manager-components';
import React, { Suspense } from 'react';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@/components/Breadcrumb/Breadcrumb';
import Loading from '@/components/Loading/Loading';
import { useRanchers } from '@/hooks/useRancher';
import Listing from './listing';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.serviceName;
}

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
    <PageLayout>
      <Suspense fallback={<Loading />}>
        <div className="mb-3">
          <Breadcrumb />
        </div>
        {data && <Listing data={data} refetchRanchers={refetch} />}
      </Suspense>
      <Outlet />
    </PageLayout>
  );
}
