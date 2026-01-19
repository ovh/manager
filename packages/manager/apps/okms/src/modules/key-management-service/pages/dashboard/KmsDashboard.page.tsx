import { Suspense } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import Breadcrumb from '@key-management-service/components/breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@key-management-service/components/guide/KmsGuidesHeader';
import { KmsChangelogButton } from '@key-management-service/components/kms-changelog-button/KmsChangelogButton.component';
import { okmsQueryKeys } from '@key-management-service/data/api/okms';
import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { BreadcrumbItem } from '@key-management-service/hooks/breadcrumb/useBreadcrumb';
import { KMS_ROUTES_URIS, KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import {
  BaseLayout,
  ErrorBanner,
  HeadersProps,
  Notifications,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';

import { PageSpinner } from '@/common/components/page-spinner/PageSpinner.component';
import {
  TabNavigation,
  TabNavigationItem,
} from '@/common/components/tab-navigation/TabNavigation.component';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { KMS_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';
import { filterFalsy } from '@/common/utils/tools/filterFalsy';
import { SERVICE_KEYS_LABEL } from '@/constants';

import { KmsDashboardOutletContext } from './KmsDashboard.type';
import { kmsDashboardTabNames } from './kmsDashboard.constants';

export default function DashboardPage() {
  const { t } = useTranslation([
    'key-management-service/dashboard',
    'key-management-service/serviceKeys',
    'key-management-service/logs',
    'key-management-service/credential',
  ]);
  const navigate = useNavigate();
  const { okmsId } = useRequiredParams('okmsId');

  const { data: okms, isPending: isOkmsLoading, error: okmsError } = useOkmsById(okmsId);

  const { data: features, isLoading: isFeatureAvailabilityLoading } = useFeatureAvailability([
    KMS_FEATURES.LOGS,
  ]);

  const tabsList: TabNavigationItem[] = filterFalsy<TabNavigationItem>([
    {
      name: kmsDashboardTabNames.generalInformation,
      title: t('key-management-service/dashboard:general_informations'),
      url: KMS_ROUTES_URLS.kmsDashboard(okmsId),
      tracking: ['general-informations'],
    },
    {
      name: kmsDashboardTabNames.serviceKeys,
      title: SERVICE_KEYS_LABEL,
      url: KMS_ROUTES_URLS.serviceKeyListing(okmsId),
      tracking: ['service-key'],
    },
    {
      name: kmsDashboardTabNames.credentials,
      title: t('key-management-service/dashboard:access_certificates'),
      url: KMS_ROUTES_URLS.credentialListing(okmsId),
      tracking: ['credential'],
    },
    features?.[KMS_FEATURES.LOGS] && {
      name: kmsDashboardTabNames.logs,
      title: t('key-management-service/dashboard:logs'),
      url: KMS_ROUTES_URLS.kmsLogs(okmsId),
      tracking: ['logs'],
    },
  ]);

  if (isOkmsLoading || isFeatureAvailabilityLoading) {
    return <PageSpinner />;
  }

  if (okmsError) {
    return (
      <ErrorBanner
        error={okmsError.response}
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.kmsListing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: okmsQueryKeys.detail(okmsId),
          })
        }
      />
    );
  }

  const { displayName } = okms.iam;

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
      label: t('key-management-service/credential:key_management_service_credential'),
      navigateTo: KMS_ROUTES_URLS.credentialListing(okmsId),
    },
    {
      id: KMS_ROUTES_URIS.kmsEditName,
      label: t('key-management-service/dashboard:key_management_service_update_name'),
      navigateTo: KMS_ROUTES_URLS.kmsEditName(okmsId),
    },
    {
      id: KMS_ROUTES_URIS.kmsLogs,
      label: t('key-management-service/logs:key_management_service_logs'),
      navigateTo: KMS_ROUTES_URLS.kmsLogs(okmsId),
    },
  ];

  const headerProps: HeadersProps = {
    title: displayName,
    headerButton: <KmsGuidesHeader />,
    changelogButton: <KmsChangelogButton />,
  };

  const contextValue: KmsDashboardOutletContext = { okms };

  return (
    <Suspense fallback={<PageSpinner />}>
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
        tabs={<TabNavigation tabs={tabsList} />}
      >
        <Outlet context={contextValue} />
      </BaseLayout>
    </Suspense>
  );
}
