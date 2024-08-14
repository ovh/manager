import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Notifications,
  BaseLayout,
  HeadersProps,
} from '@ovh-ux/manager-react-components';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import Dashboard, {
  DashboardTabItemProps,
} from '@/components/layout-helpers/Dashboard/Dashboard';
import Loading from '@/components/Loading/Loading';
import { useOKMSById } from '@/data/hooks/useOKMS';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';

export default function DashboardPage() {
  const { t: tDashboard } = useTranslation('key-management-service/dashboard');
  const { t: tServiceKeys } = useTranslation(
    'key-management-service/serviceKeys',
  );
  const { okmsId } = useParams();
  const { data: okms } = useOKMSById(okmsId);
  const displayName = okms?.data?.iam?.displayName;
  const navigate = useNavigate();

  const tabsList: DashboardTabItemProps[] = [
    {
      url: '',
      title: tDashboard('general_informations'),
    },
    {
      url: ROUTES_URLS.keys,
      title: tDashboard('encrypted_keys'),
    },
    {
      url: ROUTES_URLS.credentials,
      title: tDashboard('access_credentials'),
    },
  ];

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: okmsId,
      label: displayName,
      navigateTo: `/${okmsId}`,
    },
    {
      id: ROUTES_URLS.keys,
      label: tServiceKeys('key_management_service_service_keys'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.keys}`,
    },
  ];

  const headerProps: HeadersProps = {
    title: displayName,
    headerButton: <KmsGuidesHeader />,
  };

  return (
    <BaseLayout
      header={headerProps}
      onClickReturn={() => {
        navigate(ROUTES_URLS.root);
      }}
      backLinkLabel={tDashboard('key_management_service_dashboard_back_link')}
      breadcrumb={<Breadcrumb items={breadcrumbItems} />}
      message={<Notifications />}
      tabs={<Dashboard tabs={tabsList} />}
    >
      <Suspense fallback={<Loading />}>
        <Outlet></Outlet>
      </Suspense>
    </BaseLayout>
  );
}
