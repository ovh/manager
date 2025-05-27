import React, { createContext, Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Notifications,
  BaseLayout,
  HeadersProps,
  ErrorBanner,
  useServiceDetails,
  ChangelogButton,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import Loading from '@/components/Loading/Loading';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { KMS_ROUTES_URIS, KMS_ROUTES_URLS } from '@/routes/routes.constants';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { getOkmsResourceQueryKey } from '@/data/api/okms';
import { OKMS } from '@/types/okms.type';
import { useOkmsById } from '@/data/hooks/useOkms';
import { CHANGELOG_LINKS, SERVICE_KEYS_LABEL } from '@/constants';
import KmsTabs, {
  KmsTabProps,
} from '@/components/layout-helpers/Dashboard/KmsTabs';
import { KMS_FEATURES } from '@/utils/feature-availability/feature-availability.constants';

export const OkmsContext = createContext<OKMS>(null);

export default function DashboardPage() {
  const { t } = useTranslation([
    'key-management-service/dashboard',
    'key-management-service/serviceKeys',
    'key-management-service/logs',
    'key-management-service/credential',
  ]);
  const navigate = useNavigate();
  const { okmsId } = useParams();
  const {
    data: okms,
    isLoading: isOkmsLoading,
    isError: isOkmsError,
    error: okmsError,
  } = useOkmsById(okmsId);

  const {
    data: okmsServiceInfos,
    isLoading: isOkmsServiceInfosLoading,
    isError: isOkmsServiceInfosError,
    error: okmsServiceInfoError,
  } = useServiceDetails({ resourceName: okmsId });

  const { data: features, isLoading } = useFeatureAvailability([
    KMS_FEATURES.LOGS,
  ]);

  const displayName = okmsServiceInfos?.data?.resource.displayName;

  const tabsList: KmsTabProps[] = useMemo(
    () =>
      [
        {
          url: KMS_ROUTES_URLS.kmsDashboard(okmsId),
          content: (
            <>{t('key-management-service/dashboard:general_informations')}</>
          ),
        },
        {
          url: KMS_ROUTES_URLS.serviceKeyListing(okmsId),
          content: <>{SERVICE_KEYS_LABEL}</>,
        },
        {
          url: KMS_ROUTES_URLS.credentialListing(okmsId),
          content: (
            <>{t('key-management-service/dashboard:access_certificates')}</>
          ),
        },
        features?.[KMS_FEATURES.LOGS] && {
          url: KMS_ROUTES_URLS.kmsLogs(okmsId),
          content: (
            <div className="flex gap-2">
              {t('key-management-service/dashboard:logs')}{' '}
              <OdsBadge
                size="sm"
                label="beta"
                color="information"
                className="font-normal"
              />
            </div>
          ),
        },
      ].filter(Boolean),
    [features, t],
  );

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: okmsId,
      label: displayName,
      navigateTo: KMS_ROUTES_URLS.kmsDashboard(okmsId),
    },
    {
      id: KMS_ROUTES_URIS.serviceKeys,
      label: SERVICE_KEYS_LABEL,
      navigateTo: KMS_ROUTES_URLS.serviceKeyListing(okmsId),
    },
    {
      id: KMS_ROUTES_URIS.credentials,
      label: t(
        'key-management-service/credential:key_management_service_credential',
      ),
      navigateTo: KMS_ROUTES_URLS.credentialListing(okmsId),
    },
    {
      id: KMS_ROUTES_URIS.kmsEditName,
      label: t(
        'key-management-service/dashboard:key_management_service_update_name',
      ),
      navigateTo: KMS_ROUTES_URLS.kmsEditName(okmsId),
    },
    {
      id: KMS_ROUTES_URIS.kmsLogs,
      label: t('key-management-service/logs:key_management_service_logs'),
      navigateTo: KMS_ROUTES_URLS.kmsLogs(okmsId),
    },
  ];

  if (isOkmsServiceInfosLoading || isOkmsLoading || isLoading)
    return <Loading />;

  if (isOkmsServiceInfosError || isOkmsError) {
    return (
      <ErrorBanner
        error={
          okmsServiceInfoError
            ? okmsServiceInfoError.response
            : okmsError.response
        }
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.kmsListing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsResourceQueryKey(okmsId),
          })
        }
      />
    );
  }

  const headerProps: HeadersProps = {
    title: displayName,
    headerButton: <KmsGuidesHeader />,
    changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
  };

  return (
    <Suspense fallback={<Loading />}>
      <OkmsContext.Provider value={okms?.data}>
        <BaseLayout
          header={headerProps}
          onClickReturn={() => {
            navigate(KMS_ROUTES_URLS.kmsListing);
          }}
          backLinkLabel={t(
            'key-management-service/dashboard:key_management_service_dashboard_back_link',
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
