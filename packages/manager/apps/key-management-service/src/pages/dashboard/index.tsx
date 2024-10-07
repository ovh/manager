import React, { createContext, Suspense } from 'react';
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
import { useOKMSById } from '@/data/hooks/useOKMS';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { OKMS } from '@/types/okms.type';
import { getOkmsResourceQueryKey } from '@/data/api/okms';

export const OkmsContext = createContext<OKMS>(null);

export default function DashboardPage() {
  const { t: tDashboard } = useTranslation('key-management-service/dashboard');
  const navigate = useNavigate();
  const { t: tServiceKeys } = useTranslation(
    'key-management-service/serviceKeys',
  );
  const { okmsId } = useParams();
  const { data: okmsData, isLoading, error } = useOKMSById(okmsId);

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

  const okms = okmsData.data;

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
      label: okms.iam.displayName,
      navigateTo: `/${okmsId}`,
    },
    {
      id: ROUTES_URLS.keys,
      label: tServiceKeys('key_management_service_service_keys'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.keys}`,
    },
  ];

  const headerProps: HeadersProps = {
    title: okms.iam.displayName,
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
        <OkmsContext.Provider value={okms}>
          <Outlet />
        </OkmsContext.Provider>
      </BaseLayout>
    </Suspense>
  );
}
