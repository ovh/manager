import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useNavigate,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { ErrorBanner } from '@ovhcloud/manager-components';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@/components/Breadcrumb/Breadcrumb';
import Loading from '@/components/Loading/Loading';
import Dashboard from '@/components/layout-helpers/Dashboard/Dashboard';
import { DashboardTabItemProps } from '../../components/layout-helpers/Dashboard/Dashboard';
import { useRancher } from '@/hooks/useRancher';
import PageLayout from '@/components/PageLayout/PageLayout';
import { getRanchersUrl } from '@/utils/route';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.serviceName;
}

export default function DashboardPage() {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-rancher/dashboard');
  const { data: rancher, error, isLoading } = useRancher({
    refetchInterval: 5000,
  });
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
          onRedirectHome={() => navigate(getRanchersUrl(projectId))}
          onReloadPage={() => window.location.reload()}
          error={error.response}
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
        <Breadcrumb items={[{ label: rancher.targetSpec.name }]} />
        {rancher && <Dashboard tabs={tabsList} rancher={rancher} />}
      </Suspense>
      <Outlet />
    </PageLayout>
  );
}
