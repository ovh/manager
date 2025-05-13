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
import { ROUTES_URLS } from '@/routes/routes.constants';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { getOkmsResourceQueryKey } from '@/data/api/okms';
import { OKMS } from '@/types/okms.type';
import { useOkmsById } from '@/data/hooks/useOkms';
import { CHANGELOG_LINKS, SERVICE_KEYS_LABEL } from '@/constants';
import KmsTabs, {
  KmsTabProps,
} from '@/components/layout-helpers/Dashboard/KmsTabs';
import { FEATURES } from '@/utils/feature-availability/feature-availability.constants';

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

  const { data: features, isLoading } = useFeatureAvailability([FEATURES.LOGS]);

  const displayName = okmsServiceInfos?.data?.resource.displayName;

  const tabsList: KmsTabProps[] = useMemo(
    () =>
      [
        {
          url: '',
          content: (
            <>{t('key-management-service/dashboard:general_informations')}</>
          ),
        },
        {
          url: ROUTES_URLS.keys,
          content: <>{SERVICE_KEYS_LABEL}</>,
        },
        {
          url: ROUTES_URLS.credentials,
          content: (
            <>{t('key-management-service/dashboard:access_certificates')}</>
          ),
        },
        features?.[FEATURES.LOGS] && {
          url: ROUTES_URLS.logs,
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
      navigateTo: `/${okmsId}`,
    },
    {
      id: ROUTES_URLS.keys,
      label: SERVICE_KEYS_LABEL,
      navigateTo: `/${okmsId}/${ROUTES_URLS.keys}`,
    },
    {
      id: ROUTES_URLS.credentials,
      label: t(
        'key-management-service/credential:key_management_service_credential',
      ),
      navigateTo: `/${okmsId}/${ROUTES_URLS.credentials}`,
    },
    {
      id: ROUTES_URLS.okmsUpdateName,
      label: t(
        'key-management-service/dashboard:key_management_service_update_name',
      ),
      navigateTo: `/${okmsId}/${ROUTES_URLS.okmsUpdateName}`,
    },
    {
      id: ROUTES_URLS.logs,
      label: t('key-management-service/logs:key_management_service_logs'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.logs}`,
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
        onRedirectHome={() => navigate(ROUTES_URLS.listing)}
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
            navigate(ROUTES_URLS.root);
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
