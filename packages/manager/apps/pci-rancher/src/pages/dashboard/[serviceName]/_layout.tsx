import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useResolvedPath } from 'react-router-dom';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@/components/Breadcrumb/Breadcrumb';
import ErrorBanner from '@/components/Error/Error';
import Loading from '@/components/Loading/Loading';
import Dashboard from '@/components/layout-helpers/Dashboard/Dashboard';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.serviceName;
}

export default function DashboardPage() {
  const { t } = useTranslation('pci-rancher/dashboard');

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
    <div>
      <Breadcrumb />
      <Suspense fallback={<Loading />}>
        <Dashboard tabs={tabsList} />
      </Suspense>
    </div>
  );
}
