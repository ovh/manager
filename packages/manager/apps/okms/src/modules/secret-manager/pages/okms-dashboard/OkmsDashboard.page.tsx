import { Outlet, useNavigate } from 'react-router-dom';

import { okmsQueryKeys } from '@key-management-service/data/api/okms';
import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { OkmsBreadcrumbItem, RootBreadcrumbItem } from '@secret-manager/components/breadcrumb';
import { OkmsDashboardBreadcrumbItem } from '@secret-manager/components/breadcrumb/items/OkmsDashboardBreadcrumbItem.component';
import { SecretManagerGuidesButton } from '@secret-manager/components/guides/SecretManagerGuideButton';
import { SecretManagerChangelogButton } from '@secret-manager/components/secret-manager-changelog-button/SecretManagerChangelogButton.component';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { OdsBreadcrumb } from '@ovhcloud/ods-components/react';

import {
  BaseLayout,
  ErrorBanner,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';

import { OkmsDomainDashboardTiles } from '@/common/components/okms-dashboard/okms-domain-dashboard-tiles/OkmsDomainDashboardTiles.component';
import { PageSpinner } from '@/common/components/page-spinner/PageSpinner.component';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { OKMS_DASHBOARD_TEST_IDS } from './OkmsDashboard.constants';
import { OkmsDashboardOutletContext } from './OkmsDashboard.type';

export default function OkmsDashboardPage() {
  const { t } = useTranslation('secret-manager');
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const { okmsId } = useRequiredParams('okmsId');

  const { data: okms, isPending, error } = useOkmsById(okmsId);

  if (isPending) {
    return <PageSpinner />;
  }

  if (error) {
    return (
      <ErrorBanner
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

  const contextValue: OkmsDashboardOutletContext = {
    okms: okms.data,
  };

  return (
    <BaseLayout
      header={{
        title: t('okms_dashboard_title'),
        changelogButton: <SecretManagerChangelogButton />,
        headerButton: <SecretManagerGuidesButton />,
      }}
      backLinkLabel={t('back_to_secret_list')}
      onClickReturn={() => navigate('..')}
      breadcrumb={
        <OdsBreadcrumb>
          <RootBreadcrumbItem />
          <OkmsBreadcrumbItem />
          <OkmsDashboardBreadcrumbItem />
        </OdsBreadcrumb>
      }
      message={notifications.length > 0 ? <Notifications /> : undefined}
    >
      <OkmsDomainDashboardTiles okms={okms.data} />
      <Outlet context={contextValue} />
    </BaseLayout>
  );
}
