import { Suspense } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import Breadcrumb from '@key-management-service/components/breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@key-management-service/components/guide/KmsGuidesHeader';
import { KmsChangelogButton } from '@key-management-service/components/kms-changelog-button/KmsChangelogButton.component';
import { okmsQueryKeys } from '@key-management-service/data/api/okms';
import { getOkmsServiceKeyResourceQueryKey } from '@key-management-service/data/api/okmsServiceKey';
import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { useOkmsServiceKeyById } from '@key-management-service/data/hooks/useOkmsServiceKeys';
import { KmsBreadcrumbItem } from '@key-management-service/hooks/breadcrumb/useBreadcrumb';
import { KMS_ROUTES_URIS, KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { BaseLayout, Error, GridLayout, Notifications } from '@ovh-ux/muk';

import Loading from '@/common/components/loading/Loading';
import {
  TabNavigation,
  TabNavigationItem,
} from '@/common/components/tab-navigation/TabNavigation.component';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { SERVICE_KEYS_LABEL } from '@/constants';

import { CryptoPropertiesTile } from './CryptoPropertiesTile.component';
import { GeneralInformationTile } from './GeneralInformationTile.component';

export default function ServiceKeyDashboard() {
  const { okmsId, keyId } = useRequiredParams('okmsId', 'keyId');
  const { t } = useTranslation('key-management-service/serviceKeys');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: okms, isPending: isLoadingOkms, error: okmsError } = useOkmsById(okmsId);

  const {
    data: serviceKey,
    error: serviceKeyError,
    isPending: isLoadingServiceKey,
  } = useOkmsServiceKeyById({
    okmsId,
    keyId,
  });

  if (isLoadingServiceKey || isLoadingOkms) return <Loading />;

  if (okmsError) {
    return (
      <Error
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

  if (serviceKeyError)
    return (
      <Error
        error={serviceKeyError.response}
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.kmsListing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
          })
        }
      />
    );

  const tabsList: TabNavigationItem[] = [
    {
      name: 'general-information',
      title: t('key_management_service_service-keys_dashboard_tab_informations'),
      url: KMS_ROUTES_URLS.serviceKeyDashboard(okmsId, keyId),
      tracking: ['general-informations'],
    },
  ];

  const breadcrumbItems: KmsBreadcrumbItem[] = [
    {
      id: okmsId,
      label: okms.iam.displayName,
      navigateTo: KMS_ROUTES_URLS.kmsDashboard(okmsId),
    },
    {
      id: KMS_ROUTES_URIS.serviceKeys,
      label: SERVICE_KEYS_LABEL,
      navigateTo: KMS_ROUTES_URLS.serviceKeyListing(okmsId),
    },
    {
      id: keyId,
      label: serviceKey.name || serviceKey.id,
      navigateTo: KMS_ROUTES_URLS.serviceKeyDashboard(okmsId, keyId),
    },
    {
      id: KMS_ROUTES_URIS.serviceKeyEditName,
      label: t('key_management_service_service-keys_update_name_title'),
      navigateTo: KMS_ROUTES_URLS.serviceKeyEditName(okmsId, keyId),
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <BaseLayout
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        header={{
          title: serviceKey.name || serviceKey.id,
          guideMenu: <KmsGuidesHeader />,
          changelogButton: <KmsChangelogButton />,
        }}
        backLink={{
          label: t('key_management_service_service_keys_back_link'),
          onClick: () => {
            navigate(KMS_ROUTES_URLS.serviceKeyListing(okmsId));
          },
        }}
        message={<Notifications />}
        tabs={<TabNavigation tabs={tabsList} />}
      >
        <GridLayout>
          <GeneralInformationTile kms={okms} serviceKey={serviceKey} />
          <CryptoPropertiesTile serviceKey={serviceKey} />
        </GridLayout>
        <Outlet />
      </BaseLayout>
    </Suspense>
  );
}
