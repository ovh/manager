import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Notifications,
  BaseLayout,
  ErrorBanner,
  HeadersProps,
} from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import Dashboard, {
  DashboardTabItemProps,
} from '@/components/layout-helpers/Dashboard/Dashboard';
import Loading from '@/components/Loading/Loading';
import { useOKMSById } from '@/data/hooks/useOKMS';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { getOkmsResourceQueryKey } from '@/data/api/okms';

export default function DashboardPage() {
  const { t: tDashboard } = useTranslation('key-management-service/dashboard');
  const navigate = useNavigate();
  const { t: tServiceKeys } = useTranslation(
    'key-management-service/serviceKeys',
  );
  const { t: tCredentials } = useTranslation(
    'key-management-service/credential',
  );
  const { okmsId } = useParams();
  const { data: okms, isLoading, error } = useOKMSById(okmsId);

  if (isLoading) return <Loading />;

  if (error)
    return (
      <ErrorBanner
        error={error.response}
        onRedirectHome={() => navigate(ROUTES_URLS.listing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsResourceQueryKey(okmsId),
          })
        }
      />
    );

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
      title: tDashboard('access_certificates'),
    },
  ];

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: okmsId,
      label: okms.data.iam.displayName,
      navigateTo: `/${okmsId}`,
    },
    {
      id: ROUTES_URLS.keys,
      label: tServiceKeys('key_management_service_service_keys'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.keys}`,
    },
    {
      id: ROUTES_URLS.credentials,
      label: tCredentials('key_management_service_credential'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.credentials}`,
    },
  ];

  const headerProps: HeadersProps = {
    title: okms.data.iam.displayName,
    headerButton: <KmsGuidesHeader />,
  };

  return (
    <Suspense fallback={<Loading />}>
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
        <Outlet context={okms.data} />
      </BaseLayout>
    </Suspense>
  );
}
