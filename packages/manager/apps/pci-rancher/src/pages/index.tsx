import React, { Suspense } from 'react';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@/components/Breadcrumb/Breadcrumb';
import ErrorBanner from '@/components/Error/Error';
import Loading from '@/components/Loading/Loading';
import Listing from './listing';
import { useRanchers } from '@/hooks/useRancher';
import PageLayout from '@/components/PageLayout/PageLayout';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.serviceName;
}

export default function Home() {
  const { data, isError, error, isLoading } = useRanchers();

  if (isError) {
    return <ErrorBanner error={error} />;
  }

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <PageLayout>
      <Suspense fallback={<Loading />}>
        <div className="mb-3">
          <Breadcrumb />
        </div>
        {data?.data && <Listing data={data?.data} />}
      </Suspense>
    </PageLayout>
  );
}
