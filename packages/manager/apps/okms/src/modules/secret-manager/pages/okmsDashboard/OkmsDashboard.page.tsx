import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  BaseLayout,
  ErrorBanner,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { OdsBreadcrumb } from '@ovhcloud/ods-components/react';
import {
  OkmsBreadcrumbItem,
  RootBreadcrumbItem,
} from '@secret-manager/components/breadcrumb';
import { OkmsDashboardBreadcrumbItem } from '@secret-manager/components/breadcrumb/items/OkmsDashboardBreadcrumbItem.component';
import { SecretManagerChangelogButton } from '@secret-manager/components/secretManagerChangelogButton/SecretManagerChangelogButton.component';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { PageSpinner } from '@/common/components/pageSpinner/PageSpinner.component';
import { OkmsDomainDashboardTiles } from '@/common/components/okmsDashboard/OkmsDomainDashboardTiles.component';
import { useOkmsById } from '@/data/hooks/useOkms';
import { okmsQueryKeys } from '@/data/api/okms';
import { OkmsDashboardOutletContext } from './OkmsDashboard.type';
import { OKMS_DASHBOARD_TEST_IDS } from './OkmsDashboard.constants';

export default function OkmsDashboardPage() {
  const { t } = useTranslation('secret-manager');
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const { okmsId } = useParams<LocationPathParams>();

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
      message={notifications.length > 0 && <Notifications />}
    >
      <OkmsDomainDashboardTiles okms={okms.data} />
      <Outlet context={contextValue} />
    </BaseLayout>
  );
}
