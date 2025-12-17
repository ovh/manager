import { Outlet, useNavigate } from 'react-router-dom';

import {
  OkmsBreadcrumbItem,
  RootBreadcrumbItem,
  SecretBreadcrumbItem,
} from '@secret-manager/components/breadcrumb';
import { SecretManagerGuidesButton } from '@secret-manager/components/guides/SecretManagerGuideButton';
import { SecretManagerChangelogButton } from '@secret-manager/components/secret-manager-changelog-button/SecretManagerChangelogButton.component';
import { useSecret } from '@secret-manager/data/hooks/useSecret';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { OdsBreadcrumb } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BaseLayout,
  ErrorBanner,
  HeadersProps,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';

import Loading from '@/common/components/loading/Loading';
import {
  TabNavigation,
  TabNavigationItem,
} from '@/common/components/tab-navigation/TabNavigation.component';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { decodeSecretPath } from '@/modules/secret-manager/utils/secretPath';

import { SecretPageOutletContext } from './Secret.type';

export default function SecretPage() {
  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');
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
      tracking: ['general-informations'],
    },
    {
      name: 'versions',
      title: t('versions'),
      url: SECRET_MANAGER_ROUTES_URLS.versionList(okmsId, secretPathDecoded),
      tracking: ['version', 'list'],
    },
  ];

  const headerProps: HeadersProps = {
    title: secretPathDecoded,
    changelogButton: <SecretManagerChangelogButton />,
    headerButton: <SecretManagerGuidesButton />,
  };

  if (isSecretPending) {
    return <Loading />;
  }

  if (isSecretError) {
    return (
      <ErrorBanner
        error={secretError?.response}
        onRedirectHome={() => navigate(SECRET_MANAGER_ROUTES_URLS.secretList(okmsId))}
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
      message={notifications.length > 0 ? <Notifications /> : undefined}
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
