import {
  DashboardLayout,
  ErrorBanner,
  useMe,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import React, { Suspense } from 'react';
import {
  Outlet,
  useNavigate,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@/components/Breadcrumb/Breadcrumb.component';
import Loading from '@/components/Loading/Loading.component';
import Dashboard, {
  DashboardTabItemProps,
} from '@/components/layout-helpers/Dashboard/Dashboard.component';
import { useRancher } from '@/data/hooks/useRancher/useRancher';
import { getRanchersUrl } from '@/utils/route';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.serviceName;
}

export default function DashboardPage() {
  const { projectId } = useParams();
  const { t } = useTranslation('dashboard');
  const { data: rancher, error, isLoading } = useRancher({
    refetchInterval: 5000,
  });
  const navigate = useNavigate();

  const me = useMe();

  console.info('dashbaord useMe : ', me);

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
