import React, { createContext, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Notifications,
  BaseLayout,
  HeadersProps,
  ErrorBanner,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import Loading from '@/components/Loading/Loading';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { getOkmsResourceQueryKey } from '@/data/api/okms';
import { OKMS } from '@/types/okms.type';
import { useOKMSById } from '@/data/hooks/useOKMS';
import KmsTabs, {
  KmsTabProps,
} from '@/components/layout-helpers/Dashboard/KmsTabs';

export const OkmsContext = createContext<OKMS>(null);

export default function DashboardPage() {
  const { t: tDashboard } = useTranslation('key-management-service/dashboard');
  const navigate = useNavigate();
  const { t: tServiceKeys } = useTranslation(
    'key-management-service/serviceKeys',
  );
  const { t: tCredentials } = useTranslation(
    'key-management-service/credential',
  );
  const { t: tLogs } = useTranslation('key-management-service/logs');

  const { okmsId } = useParams();
  const {
    data: okms,
    isLoading: isOkmsLoading,
    isError: isOkmsError,
    error: okmsError,
  } = useOKMSById(okmsId);

  const {
    data: okmsServiceInfos,
    isLoading: isOkmsServiceInfosLoading,
    isError: isOkmsServiceInfosError,
    error: okmsServiceInfoError,
  } = useServiceDetails({ resourceName: okmsId });

  if (isOkmsServiceInfosLoading || isOkmsLoading) return <Loading />;

  if (isOkmsServiceInfosError || isOkmsError) {
    return (
      <ErrorBanner
        error={
          okmsServiceInfoError
            ? okmsServiceInfoError.response
            : okmsError.response
        }
        onRedirectHome={() => navigate(ROUTES_URLS.listing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsResourceQueryKey(okmsId),
          })
        }
      />
    );
  }

  const displayName = okmsServiceInfos?.data?.resource.displayName;

  const tabsList: KmsTabProps[] = [
    {
      url: '',
      content: <>{tDashboard('general_informations')}</>,
    },
    {
      url: ROUTES_URLS.keys,
      content: <>{tDashboard('encrypted_keys')}</>,
    },
    {
      url: ROUTES_URLS.credentials,
      content: <>{tDashboard('access_certificates')}</>,
    },
    {
      url: ROUTES_URLS.logs,
      content: (
        <div className="flex gap-2">
          {tDashboard('logs')}{' '}
          <OdsBadge
            size="sm"
            label="beta"
            color="information"
            className="font-normal"
          />
        </div>
      ),
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
      id: ROUTES_URLS.credentials,
      label: tCredentials('key_management_service_credential'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.credentials}`,
    },
    {
      id: ROUTES_URLS.okmsUpdateName,
      label: tDashboard('key_management_service_update_name'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.okmsUpdateName}`,
    },
    {
      id: ROUTES_URLS.logs,
      label: tLogs('key_management_service_logs'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.logs}`,
    },
  ];

  const headerProps: HeadersProps = {
    title: displayName,
    headerButton: <KmsGuidesHeader />,
  };

  return (
    <Suspense fallback={<Loading />}>
      <OkmsContext.Provider value={okms?.data}>
        <BaseLayout
          header={headerProps}
          onClickReturn={() => {
            navigate(ROUTES_URLS.root);
          }}
          backLinkLabel={tDashboard(
            'key_management_service_dashboard_back_link',
          )}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          message={<Notifications />}
          tabs={<KmsTabs tabs={tabsList} />}
        >
          <Outlet />
        </BaseLayout>
      </OkmsContext.Provider>
    </Suspense>
  );
}
