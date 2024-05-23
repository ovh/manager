import { DashboardLayout, ErrorBanner } from '@ovhcloud/manager-components';
import React, { Suspense } from 'react';
import {
  Outlet,
  useNavigate,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@/components/Breadcrumb/Breadcrumb';
import Loading from '@/components/Loading/Loading';
import Dashboard from '@/components/layout-helpers/Dashboard/Dashboard';
import { useRancher } from '@/hooks/useRancher';
import { getRanchersUrl } from '@/utils/route';
import { DashboardTabItemProps } from '../../components/layout-helpers/Dashboard/Dashboard';
import { useTranslate } from '@/utils/translation';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.serviceName;
}

export default function DashboardPage() {
  const { projectId } = useParams();
  const { t } = useTranslate('pci-rancher/dashboard');
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
    <Suspense fallback={<Loading />}>
      <DashboardLayout
        breadcrumb={<Breadcrumb items={[{ label: rancher.targetSpec.name }]} />}
        content={rancher && <Dashboard tabs={tabsList} rancher={rancher} />}
      />
      <Outlet />
    </Suspense>
  );
}
