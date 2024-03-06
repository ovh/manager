import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useResolvedPath } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { getcloudProjectService, getcloudProjectServiceQueryKey } from '@/api';
import Dashboard from '@/components/layout-helpers/Dashboard/Dashboard';
import Loading from '@/components/Loading/Loading';
import Errors from '@/components/Error/Error';

export default function DashboardPage() {
  const { t } = useTranslation('pci-file-storage/dashboard');
  const { serviceName } = useParams();
  const results: any = useQueries({
    queries: [
      {
        queryKey: [getcloudProjectServiceQueryKey({ serviceName })],
        queryFn: () => getcloudProjectService({ serviceName }),
        staleTime: Infinity,
      },
    ],
  });

  const tabsList = [
    {
      name: 'general_infos',
      title: t('general_informations'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'custom tab',
      title: 'custom tab',
      to: useResolvedPath('Tabs2').pathname,
    },
  ];

  const { error, isLoading } = results[0];

  if (error) {
    return (
      <div className="flex justify-center">
        <div className="w-3/5">
          <Errors error={error.response} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb />
      <Suspense fallback={<Loading />}>
        <Dashboard tabs={tabsList} />
      </Suspense>
    </div>
  );
}
