import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Notifications,
  BaseLayout,
  HeadersProps,
  ErrorBanner,
} from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import Dashboard, {
  DashboardTabItemProps,
} from '@/components/layout-helpers/Dashboard/Dashboard';
import Loading from '@/components/Loading/Loading';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { getOkmsResourceQueryKey } from '@/data/api/okms';
import { useKMSServiceInfos } from '@/data/hooks/useKMSServiceInfos';

export default function DashboardPage() {
  const { t: tDashboard } = useTranslation('key-management-service/dashboard');
  const { t: tServiceKeys } = useTranslation(
    'key-management-service/serviceKeys',
  );
  const { okmsId } = useParams();
  const navigate = useNavigate();
  const {
    data: okmsServiceInfos,
    isLoading: isOkmsServiceInfosLoading,
    isError: isOkmsServiceInfosError,
    error: OkmsServiceInfoError,
  } = useKMSServiceInfos(okmsId);
  const displayName = okmsServiceInfos?.data?.resource.displayName;

  if (isOkmsServiceInfosLoading) return <Loading />;

  if (isOkmsServiceInfosError)
    return (
      <ErrorBanner
        error={OkmsServiceInfoError.response}
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
      url: ROUTES_URLS.certificates,
      title: tDashboard('access_certificates'),
      disabled: true,
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
    {
      id: ROUTES_URLS.okmsUpdateName,
      label: tDashboard('key_management_service_update_name'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.okmsUpdateName}`,
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
