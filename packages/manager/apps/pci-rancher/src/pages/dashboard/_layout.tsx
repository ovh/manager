import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useResolvedPath } from 'react-router-dom';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@/components/Breadcrumb/Breadcrumb';
import ErrorBanner from '@/components/Error/Error';
import Loading from '@/components/Loading/Loading';
import Dashboard from '@/components/layout-helpers/Dashboard/Dashboard';
import { useRancher } from '@/hooks/useRancher';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.serviceName;
}

export default function DashboardPage() {
  const { t } = useTranslation('pci-rancher/dashboard');
  const { data } = useRancher();

  const tabsList = [
    {
      name: 'general_infos',
      title: t('general_informations'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'custom tab',
      title: t('allowedIps'),
      to: useResolvedPath('Tabs2').pathname,
      disabled: true,
    },
  ];

  const { error, isLoading } = {} as any;

  if (error) {
    return <ErrorBanner error={error.response} />;
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
      <Breadcrumb />
      <Suspense fallback={<Loading />}>
        {data?.data && <Dashboard tabs={tabsList} rancher={data.data} />}
      </Suspense>
    </div>
  );
}
