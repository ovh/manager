import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import {
  BaseLayout,
  Clipboard,
  ErrorBanner,
  ManagerButton,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  OsdsIcon,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import { useOkmsServiceKeyById } from '@/data/hooks/useOkmsServiceKeys';
import Loading from '@/components/Loading/Loading';
import { TileItem } from '@/components/dashboard/tile-item/tileItem.component';
import { Tile } from '@/components/dashboard/tile/tile.component';
import { TileValue } from '@/components/dashboard/tile-value/tileValue.component';
import { TileValueDate } from '@/components/dashboard/tile-value-date/tileValueDate.component';
import { ServiceKeyStatus } from '@/components/serviceKey/serviceKeyStatus/serviceKeyStatus.component';
import { ServiceKeyOperations } from '@/components/serviceKey/serviceKeyOperations/serviceKeyOperations.component';
import { ServiceKeyType } from '@/components/serviceKey/serviceKeyType/serviceKeyType.component';
import { TileSeparator } from '@/components/dashboard/tile-separator/tileSeparator';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { getOkmsServiceKeyResourceQueryKey } from '@/data/api/okmsServiceKey';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { useOKMSById } from '@/data/hooks/useOKMS';
import ServiceKeyStateActions from '@/components/serviceKey/serviceKeyStateActions/ServiceKeyStateActions.component';
import { getOkmsResourceQueryKey } from '@/data/api/okms';

export default function Key() {
  const { okmsId, keyId } = useParams();
  const { t } = useTranslation('key-management-service/serviceKeys');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      label: t('key_management_service_service_keys'),
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
        }}
        backLinkLabel={t('key_management_service_service_keys_back_link')}
        message={<Notifications />}
        tabs={
          <OsdsTabs>
            <OsdsTabBar slot="top">
              <OsdsTabBarItem panel="tab1" role="tab">
                {t(
                  'key_management_service_service-keys_dashboard_tab_informations',
                )}
              </OsdsTabBarItem>
            </OsdsTabBar>
          </OsdsTabs>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Tile
            title={t(
              'key_management_service_service-keys_dashboard_tile_general_informations',
            )}
          >
            <TileSeparator />
            <TileItem
              title={t(
                'key_management_service_service-keys_dashboard_field_name',
              )}
            >
              <div className="flex justify-between items-center">
                <TileValue value={kmsKey.name} />
                <ManagerButton
                  circle
                  variant={ODS_BUTTON_VARIANT.stroked}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  onClick={() => navigate(ROUTES_URLS.serviceKeyEditName)}
                  urn={kms.iam.urn}
                  iamActions={['okms:apiovh:serviceKey/update']}
                >
                  <OsdsIcon
                    name={ODS_ICON_NAME.PEN}
                    size={ODS_ICON_SIZE.xs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </ManagerButton>
              </div>
            </TileItem>
            <TileSeparator />
            <TileItem
              title={t(
                'key_management_service_service-keys_dashboard_field_id',
              )}
            >
              <Clipboard value={kmsKey.id} />
            </TileItem>
            <TileSeparator />
            <TileItem
              title={t(
                'key_management_service_service-keys_dashboard_field_state',
              )}
              titleStatus={<ServiceKeyStatus state={kmsKey.state} />}
            >
              <div className="flex flex-col max-w-fit justify-start">
                <ServiceKeyStateActions okms={kms} okmsKey={kmsKey} />
              </div>
            </TileItem>
            <TileSeparator />
            <TileItem
              title={t(
                'key_management_service_service-keys_dashboard_field_created_at',
              )}
            >
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
            </TileItem>
          </Tile>
          <Tile
            title={t(
              'key_management_service_service-keys_dashboard_tile_crypto_properties',
            )}
          >
            <TileSeparator />
            <TileItem
              title={t(
                'key_management_service_service-keys_dashboard_field_origin',
              )}
            >
              <TileValue
                value={t(
                  'key_management_service_service-keys_dashboard_field_origin_okms',
                )}
              />
            </TileItem>
            <TileSeparator />
            <TileItem
              title={t(
                'key_management_service_service-keys_dashboard_field_type',
              )}
            >
              <ServiceKeyType type={kmsKey.type} />
            </TileItem>
            <TileSeparator />
            {kmsKey.size && (
              <TileItem
                title={t(
                  'key_management_service_service-keys_dashboard_field_size',
                )}
              >
                <TileValue value={kmsKey.size} />
              </TileItem>
            )}
            {kmsKey.curve && (
              <TileItem
                title={t(
                  'key_management_service_service-keys_dashboard_field_curve',
                )}
              >
                <TileValue value={kmsKey.curve} />
              </TileItem>
            )}
            <TileSeparator />
            <TileItem
              title={t(
                'key_management_service_service-keys_dashboard_field_operations',
              )}
            >
              <ServiceKeyOperations operations={kmsKey.operations} />
            </TileItem>
          </Tile>
        </div>
        <Outlet />
      </BaseLayout>
    </Suspense>
  );
}
