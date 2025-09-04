import React from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import {
  BaseLayout,
  ErrorBanner,
  HeadersProps,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { SecretDashboardPageOutletContext } from '@secret-manager/pages/dashboard/dashboard.type';
import { useSecret } from '@secret-manager/data/hooks/useSecret';
import { OdsBreadcrumb } from '@ovhcloud/ods-components/react';
import {
  DomainBreadcrumbItem,
  RootBreadcrumbItem,
  SecretBreadcrumbItem,
} from '@secret-manager/components/breadcrumb';
import { decodeSecretPath } from '@/modules/secret-manager/utils/secretPath';
import Loading from '@/components/Loading/Loading';
import {
  TabNavigation,
  TabNavigationItem,
} from '@/common/components/tabNavigation/TabNavigation.component';

export default function SecretDashboardPage() {
  const { domainId, secretPath } = useParams<LocationPathParams>();
  const secretPathDecoded = decodeSecretPath(secretPath);
  const { t } = useTranslation('secret-manager');
  const navigate = useNavigate();
  const { notifications } = useNotifications();

  const {
    data: secret,
    isPending: isSecretPending,
    isError: isSecretError,
    error: secretError,
  } = useSecret(domainId, secretPathDecoded);

  const tabsList: TabNavigationItem[] = [
    {
      name: 'general-information',
      title: t('general_information'),
      url: SECRET_MANAGER_ROUTES_URLS.secretDashboard(
        domainId,
        secretPathDecoded,
      ),
    },
    {
      name: 'versions',
      title: t('versions'),
      url: SECRET_MANAGER_ROUTES_URLS.secretVersions(
        domainId,
        secretPathDecoded,
      ),
    },
  ];

  const headerProps: HeadersProps = {
    title: secretPathDecoded,
  };

  if (isSecretPending) {
    return <Loading />;
  }

  if (isSecretError) {
    return (
      <ErrorBanner
        error={secretError?.response}
        onRedirectHome={() =>
          navigate(SECRET_MANAGER_ROUTES_URLS.secretListing(domainId))
        }
      />
    );
  }

  const outletContext: SecretDashboardPageOutletContext = {
    secret,
  };

  return (
    <BaseLayout
      header={headerProps}
      backLinkLabel={t('back_to_secret_list')}
      message={notifications.length > 0 && <Notifications />}
      breadcrumb={
        <OdsBreadcrumb>
          <RootBreadcrumbItem />
          <DomainBreadcrumbItem />
          <SecretBreadcrumbItem />
        </OdsBreadcrumb>
      }
      tabs={<TabNavigation tabs={tabsList} />}
      onClickReturn={() => {
        navigate(SECRET_MANAGER_ROUTES_URLS.secretListing(domainId));
      }}
    >
      <Outlet context={outletContext} />
    </BaseLayout>
  );
}
