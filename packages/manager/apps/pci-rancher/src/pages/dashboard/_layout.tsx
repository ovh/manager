import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useResolvedPath } from 'react-router-dom';
import { ErrorBanner } from '@ovhcloud/manager-components';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@/components/Breadcrumb/Breadcrumb';
import Loading from '@/components/Loading/Loading';
import Dashboard from '@/components/layout-helpers/Dashboard/Dashboard';
import { DashboardTabItemProps } from '../../components/layout-helpers/Dashboard/Dashboard';
import { useRancher } from '@/hooks/useRancher';
import PageLayout from '@/components/PageLayout/PageLayout';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.serviceName;
}

export default function DashboardPage() {
  const { t } = useTranslation('pci-rancher/dashboard');
  const { data, error, isLoading } = useRancher();
  const navigate = useNavigate();

  const tabsList: DashboardTabItemProps[] = [
    {
      name: 'general_infos',
      title: t('general_informations'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'custom tab',
      title: t('allowedIps'),
      to: useResolvedPath('Tabs2').pathname,
      isDisabled: true,
      isComingSoon: true,
    },
  ];

  if (error) {
    return (
      <Suspense>
        <ErrorBanner
          onRedirectHome={() => navigate('')}
          error={error?.response}
        />
      </Suspense>
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
    <PageLayout>
      <Suspense fallback={<Loading />}>
        <Breadcrumb items={[{ label: data?.data.targetSpec.name }]} />
        {data?.data && <Dashboard tabs={tabsList} rancher={data.data} />}
      </Suspense>
    </PageLayout>
  );
}
