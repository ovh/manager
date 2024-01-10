import { useQuery } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { getRancherProjectById } from '@/api';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@/components/Breadcrumb/Breadcrumb';
import ErrorBanner from '@/components/Error/Error';
import Loading from '@/components/Loading/Loading';
import Listing from './listing';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.serviceName;
}

export default function Home() {
  const { projectId } = useParams();
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getRancherProjectById(projectId),
  });

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
    <div className="m-10">
      <Suspense fallback={<Loading />}>
        <div className="mb-3">
          <Breadcrumb />
        </div>
        {data?.data && <Listing data={data?.data} />}
      </Suspense>
    </div>
  );
}
