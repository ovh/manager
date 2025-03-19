import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import {
  BaseLayout,
  Clipboard,
  DashboardGridLayout,
  DashboardTile,
  ErrorBanner,
  ManagerButton,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { OdsTabs, OdsTab, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_PRESET,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import { useOkmsServiceKeyById } from '@/data/hooks/useOkmsServiceKeys';
import Loading from '@/components/Loading/Loading';
import { TileValueDate } from '@/components/dashboard/tile-value-date/tileValueDate.component';
import { ServiceKeyStatus } from '@/components/serviceKey/serviceKeyStatus/serviceKeyStatus.component';
import { ServiceKeyOperations } from '@/components/serviceKey/serviceKeyOperations/serviceKeyOperations.component';
import { ServiceKeyType } from '@/components/serviceKey/serviceKeyType/serviceKeyType.component';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { getOkmsServiceKeyResourceQueryKey } from '@/data/api/okmsServiceKey';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { useOKMSById } from '@/data/hooks/useOKMS';
import ServiceKeyStateActions from '@/components/serviceKey/serviceKeyStateActions/ServiceKeyStateActions.component';
import { getOkmsResourceQueryKey } from '@/data/api/okms';
import { kmsIamActions } from '@/utils/iam/iam.constants';
import { SERVICE_KEY_TEST_IDS } from './ServiceKey.constants';
import { SERVICE_KEYS_LABEL } from '@/constants';

export default function Key() {
  const { okmsId, keyId } = useParams();
  const { t } = useTranslation('key-management-service/serviceKeys');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const {
    data: okms,
    isLoading: isLoadingOkms,
    error: okmsError,
  } = useOKMSById(okmsId);

  const {
    data: serviceKey,
    error: serviceKeyError,
    isLoading: isLoadingServiceKey,
  } = useOkmsServiceKeyById({
    okmsId,
    keyId,
  });

  if (isLoadingServiceKey || isLoadingOkms) return <Loading />;

  if (okmsError || serviceKeyError)
    return (
      <ErrorBanner
        error={okmsError ? okmsError.response : serviceKeyError.response}
        onRedirectHome={() => navigate(ROUTES_URLS.listing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: okmsError
              ? getOkmsResourceQueryKey(okmsId)
              : getOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
          })
        }
      />
    );

  const kms = okms.data;
  const kmsKey = serviceKey.data;

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: okmsId,
      label: kms.iam.displayName,
      navigateTo: `/${okmsId}`,
    },
    {
      id: ROUTES_URLS.keys,
      label: SERVICE_KEYS_LABEL,
      navigateTo: `/${okmsId}/${ROUTES_URLS.keys}`,
    },
    {
      id: keyId,
      label: kmsKey.name,
      navigateTo: `/${okmsId}/${ROUTES_URLS.keys}/${keyId}`,
    },
    {
      id: ROUTES_URLS.serviceKeyEditName,
      label: t('key_management_service_service-keys_update_name_title'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.keys}/${ROUTES_URLS.serviceKeyEditName}`,
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
          navigate(`/${okmsId}/${ROUTES_URLS.keys}`);
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
          <DashboardTile
            title={t(
              'key_management_service_service-keys_dashboard_tile_general_informations',
            )}
            items={[
              {
                id: 'name',
                label: t(
                  'key_management_service_service-keys_dashboard_field_name',
                ),
                value: (
                  <div className="flex justify-between items-center gap-2">
                    <OdsText
                      className="max-w-1/2 text-ellipsis overflow-hidden"
                      preset={ODS_TEXT_PRESET.paragraph}
                      data-testid="truc"
                    >
                      {kmsKey.name}
                    </OdsText>
                    <ManagerButton
                      id="editName"
                      label=""
                      data-testid={SERVICE_KEY_TEST_IDS.editNameButton}
                      size={ODS_BUTTON_SIZE.sm}
                      variant={ODS_BUTTON_VARIANT.ghost}
                      color={ODS_BUTTON_COLOR.primary}
                      urn={serviceKey.data.iam.urn}
                      iamActions={[kmsIamActions.serviceKeyUpdate]}
                      onClick={() => {
                        trackClick({
                          location: PageLocation.page,
                          buttonType: ButtonType.button,
                          actionType: 'action',
                          actions: ['rename_encryption_key'],
                        });
                        navigate(ROUTES_URLS.serviceKeyEditName);
                      }}
                      icon={ODS_ICON_NAME.pen}
                    />
                  </div>
                ),
              },
              {
                id: 'id',
                label: t(
                  'key_management_service_service-keys_dashboard_field_id',
                ),
                value: <Clipboard className="w-full" value={kmsKey.id} />,
              },
              {
                id: 'state',
                label: t(
                  'key_management_service_service-keys_dashboard_field_state',
                ),
                value: (
                  <div>
                    <ServiceKeyStatus state={kmsKey.state} />
                    <ServiceKeyStateActions okms={kms} okmsKey={kmsKey} />
                  </div>
                ),
              },
              {
                id: 'createdAt',
                label: t(
                  'key_management_service_service-keys_dashboard_field_created_at',
                ),
                value: (
                  <TileValueDate
                    value={kmsKey.createdAt}
                    options={{
                      hour12: false,
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                    }}
                  />
                ),
              },
            ]}
          />
          <DashboardTile
            title={t(
              'key_management_service_service-keys_dashboard_tile_crypto_properties',
            )}
            items={[
              {
                id: 'origin',
                label: t(
                  'key_management_service_service-keys_dashboard_field_origin',
                ),
                value: (
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t(
                      'key_management_service_service-keys_dashboard_field_origin_okms',
                    )}
                  </OdsText>
                ),
              },
              {
                id: 'type',
                label: t(
                  'key_management_service_service-keys_dashboard_field_type',
                ),
                value: <ServiceKeyType type={kmsKey.type} />,
              },
              kmsKey.size && {
                id: 'size',
                label: t(
                  'key_management_service_service-keys_dashboard_field_size',
                ),
                value: (
                  <OdsText preset={ODS_TEXT_PRESET.span}>{kmsKey.size}</OdsText>
                ),
              },
              kmsKey.curve && {
                id: 'size',
                label: t(
                  'key_management_service_service-keys_dashboard_field_curve',
                ),
                value: (
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {kmsKey.curve}
                  </OdsText>
                ),
              },
              {
                id: 'operations',
                label: t(
                  'key_management_service_service-keys_dashboard_field_operations',
                ),
                value: <ServiceKeyOperations operations={kmsKey.operations} />,
              },
            ].filter(Boolean)}
          />
        </DashboardGridLayout>
        <Outlet />
      </BaseLayout>
    </Suspense>
  );
}
