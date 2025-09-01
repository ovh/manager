import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import {
  BaseLayout,
  DashboardGridLayout,
  ErrorBanner,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import { useOkmsServiceKeyById } from '@/data/hooks/useOkmsServiceKeys';
import Loading from '@/components/Loading/Loading';
import { KMS_ROUTES_URIS, KMS_ROUTES_URLS } from '@/routes/routes.constants';
import { getOkmsServiceKeyResourceQueryKey } from '@/data/api/okmsServiceKey';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { useOkmsById } from '@/data/hooks/useOkms';
import { getOkmsResourceQueryKey } from '@/data/api/okms';
import { SERVICE_KEYS_LABEL } from '@/constants';
import { GeneralInformationTile } from './GeneralInformationTile.component';
import { CryptoPropertiesTile } from './CryptoPropertiesTile.component';

export default function ServiceKeyDashboard() {
  const { okmsId, keyId } = useParams() as {
    okmsId: string;
    keyId: string;
  };
  const { t } = useTranslation('key-management-service/serviceKeys');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const {
    data: okms,
    isPending: isLoadingOkms,
    error: okmsError,
  } = useOkmsById(okmsId);

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
      <ErrorBanner
        error={okmsError.response}
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.kmsListing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsResourceQueryKey(okmsId),
          })
        }
      />
    );
  }

  if (serviceKeyError)
    return (
      <ErrorBanner
        error={serviceKeyError.response}
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.kmsListing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
          })
        }
      />
    );

  const kms = okms?.data;
  const kmsKey = serviceKey?.data;

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: okmsId,
      label: kms.iam.displayName,
      navigateTo: KMS_ROUTES_URLS.kmsDashboard(okmsId),
    },
    {
      id: KMS_ROUTES_URIS.serviceKeys,
      label: SERVICE_KEYS_LABEL,
      navigateTo: KMS_ROUTES_URLS.serviceKeyListing(okmsId),
    },
    {
      id: keyId,
      label: kmsKey.name || kmsKey.id,
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
          title: kmsKey.name || kmsKey.id,
          headerButton: <KmsGuidesHeader />,
        }}
        onClickReturn={() => {
          navigate(KMS_ROUTES_URLS.serviceKeyListing(okmsId));
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: ['return_listing_page'],
          });
        }}
        backLinkLabel={t('key_management_service_service_keys_back_link')}
        message={<Notifications />}
        tabs={
          <OdsTabs>
            <OdsTab>
              {t(
                'key_management_service_service-keys_dashboard_tab_informations',
              )}
            </OdsTab>
          </OdsTabs>
        }
      >
        <DashboardGridLayout>
          <GeneralInformationTile kms={kms} serviceKey={kmsKey} />
          <CryptoPropertiesTile serviceKey={kmsKey} />
        </DashboardGridLayout>
        <Outlet />
      </BaseLayout>
    </Suspense>
  );
}
