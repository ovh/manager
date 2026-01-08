import { Suspense } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { okmsQueryKeys } from '@key-management-service/data/api/okms';
import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { OkmsBreadcrumbItem, RootBreadcrumbItem } from '@secret-manager/components/breadcrumb';
import { OkmsDashboardBreadcrumbItem } from '@secret-manager/components/breadcrumb/items/OkmsDashboardBreadcrumbItem.component';
import { SecretManagerGuidesButton } from '@secret-manager/components/guides/SecretManagerGuideButton';
import { SecretManagerChangelogButton } from '@secret-manager/components/secret-manager-changelog-button/SecretManagerChangelogButton.component';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { Breadcrumb } from '@ovhcloud/ods-react';

import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { useNotifications } from '@ovh-ux/muk';
import { BaseLayout, Error, Notifications } from '@ovh-ux/muk';

import { PageSpinner } from '@/common/components/page-spinner/PageSpinner.component';
import {
  TabNavigation,
  TabNavigationItem,
} from '@/common/components/tab-navigation/TabNavigation.component';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { KMS_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';
import { filterFalsy } from '@/common/utils/tools/filterFalsy';

import { OKMS_DASHBOARD_TEST_IDS } from './OkmsDashboard.constants';
import { OkmsDashboardOutletContext } from './OkmsDashboard.type';

export default function OkmsDashboardPage() {
  const { t } = useTranslation(['secret-manager', 'key-management-service/dashboard']);
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const { okmsId } = useRequiredParams('okmsId');

  const { data: okms, isPending, error } = useOkmsById(okmsId);

  const { data: features, isPending: isFeatureAvailabilityLoading } = useFeatureAvailability([
    KMS_FEATURES.LOGS,
  ]);

  const tabsList: TabNavigationItem[] = filterFalsy<TabNavigationItem>([
    {
      name: 'general-information',
      title: t('key-management-service/dashboard:general_informations'),
      url: SECRET_MANAGER_ROUTES_URLS.okmsDashboard(okmsId),
      tracking: ['general-informations'],
    },
    features?.[KMS_FEATURES.LOGS] && {
      name: 'logs',
      title: t('key-management-service/dashboard:logs'),
      url: SECRET_MANAGER_ROUTES_URLS.okmsDashboardLogs(okmsId),
      tracking: ['logs'],
    },
  ]);

  if (isPending || isFeatureAvailabilityLoading) {
    return <PageSpinner />;
  }

  if (error) {
    return (
      <Error
        error={error.response}
        onRedirectHome={() => navigate(SECRET_MANAGER_ROUTES_URLS.root)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: okmsQueryKeys.detail(okmsId),
          })
        }
        data-testid={OKMS_DASHBOARD_TEST_IDS.errorBanner}
      />
    );
  }

  const contextValue: OkmsDashboardOutletContext = { okms };

  return (
    <BaseLayout
      header={{
        title: t('okms_dashboard_title'),
        changelogButton: <SecretManagerChangelogButton />,
        guideMenu: <SecretManagerGuidesButton />,
      }}
      backLink={{
        label: t('back_to_secret_list'),
        onClick: () => navigate('..'),
      }}
      breadcrumb={
        <Breadcrumb>
          <RootBreadcrumbItem />
          <OkmsBreadcrumbItem />
          <OkmsDashboardBreadcrumbItem />
        </Breadcrumb>
      }
      message={notifications.length > 0 ? <Notifications /> : undefined}
      tabs={<TabNavigation tabs={tabsList} />}
    >
      <Suspense fallback={null}>
        <Outlet context={contextValue} />
      </Suspense>
    </BaseLayout>
  );
}
