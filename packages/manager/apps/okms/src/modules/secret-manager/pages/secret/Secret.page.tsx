import React from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import {
  BaseLayout,
  ErrorBanner,
  HeadersProps,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { useSecret } from '@secret-manager/data/hooks/useSecret';
import { OdsBreadcrumb } from '@ovhcloud/ods-components/react';
import {
  OkmsBreadcrumbItem,
  RootBreadcrumbItem,
  SecretBreadcrumbItem,
} from '@secret-manager/components/breadcrumb';
import { SecretManagerChangelogButton } from '@secret-manager/components/secretManagerChangelogButton/SecretManagerChangelogButton.component';
import { SecretPageOutletContext } from './Secret.type';
import { decodeSecretPath } from '@/modules/secret-manager/utils/secretPath';
import Loading from '@/components/Loading/Loading';
import {
  TabNavigation,
  TabNavigationItem,
} from '@/common/components/tabNavigation/TabNavigation.component';

export default function SecretPage() {
  const { okmsId, secretPath } = useParams<LocationPathParams>();
  const secretPathDecoded = decodeSecretPath(secretPath);
  const { t } = useTranslation(['secret-manager', NAMESPACES.DASHBOARD]);
  const navigate = useNavigate();
  const { notifications } = useNotifications();

  const {
    data: secret,
    isPending: isSecretPending,
    isError: isSecretError,
    error: secretError,
  } = useSecret(okmsId, secretPathDecoded);

  const tabsList: TabNavigationItem[] = [
    {
      name: 'general-information',
      title: t('general_information', { ns: NAMESPACES.DASHBOARD }),
      url: SECRET_MANAGER_ROUTES_URLS.secret(okmsId, secretPathDecoded),
    },
    {
      name: 'versions',
      title: t('versions'),
      url: SECRET_MANAGER_ROUTES_URLS.versionList(okmsId, secretPathDecoded),
    },
  ];

  const headerProps: HeadersProps = {
    title: secretPathDecoded,
    changelogButton: <SecretManagerChangelogButton />,
  };

  if (isSecretPending) {
    return <Loading />;
  }

  if (isSecretError) {
    return (
      <ErrorBanner
        error={secretError?.response}
        onRedirectHome={() =>
          navigate(SECRET_MANAGER_ROUTES_URLS.secretList(okmsId))
        }
      />
    );
  }

  const outletContext: SecretPageOutletContext = {
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
          <OkmsBreadcrumbItem />
          <SecretBreadcrumbItem />
        </OdsBreadcrumb>
      }
      tabs={<TabNavigation tabs={tabsList} />}
      onClickReturn={() => {
        navigate(SECRET_MANAGER_ROUTES_URLS.secretList(okmsId));
      }}
    >
      <Outlet context={outletContext} />
    </BaseLayout>
  );
}
