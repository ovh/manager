import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import {
  ActionMenu,
  ActionMenuItem,
  DashboardLayout,
  ErrorBanner,
  Notifications,
} from '@ovhcloud/manager-components';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  OsdsButton,
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
import { Clipboard } from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/InformationsTile';
import { TileItem } from '@/components/dashboard/tileItem/tileItem.component';
import { Tile } from '@/components/dashboard/tile/tile.component';
import { TileValue } from '@/components/dashboard/tileValue/tileValue.component';
import { TileValueDate } from '@/components/dashboard/tileValueDate/tileValueDate.component';
import { ServiceKeyStatus } from '@/components/serviceKey/serviceKeyStatus/serviceKeyStatus.component';
import { ServiceKeyOperations } from '@/components/serviceKey/serviceKeyOperations/serviceKeyOperations.component';
import { ServiceKeyType } from '@/components/serviceKey/serviceKeyType/serviceKeyType.component';
import { TileSeparator } from '@/components/dashboard/tileSeparator/tileSeparator';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { getOkmsServiceKeyResourceQueryKey } from '@/data/api/okmsServiceKey';

export default function Key() {
  const { okmsId, keyId } = useParams();
  const { data, error, isLoading } = useOkmsServiceKeyById({ okmsId, keyId });
  const { t } = useTranslation('key-management-service/serviceKeys');
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const kmsKey = data?.data;

  const statusMenuItem: ActionMenuItem[] = [
    {
      id: 1,
      label: 'TODO: actions',
      color: ODS_THEME_COLOR_INTENT.primary,
      onClick: () => {},
    },
  ];

  if (isLoading) return <Loading />;

  if (error)
    return (
      <ErrorBanner
        error={error.response}
        onRedirectHome={() => navigate(ROUTES_URLS.listing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
          })
        }
      />
    );

  return (
    <Suspense fallback={<Loading />}>
      <DashboardLayout
        breadcrumb={<Breadcrumb />}
        header={{
          title: kmsKey.name || kmsKey.id,
          headerButton: <KmsGuidesHeader />,
        }}
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
        content={
          <>
            <div className="w-full block">
              <div className="mb-6">
                <Notifications />
              </div>
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
                      <OsdsButton
                        circle
                        variant={ODS_BUTTON_VARIANT.stroked}
                        color={ODS_THEME_COLOR_INTENT.primary}
                        onClick={() => navigate(ROUTES_URLS.serviceKeyEditName)}
                      >
                        <OsdsIcon
                          name={ODS_ICON_NAME.PEN}
                          size={ODS_ICON_SIZE.xs}
                          color={ODS_THEME_COLOR_INTENT.primary}
                        />
                      </OsdsButton>
                    </div>
                  </TileItem>
                  <TileSeparator />
                  <TileItem
                    title={t(
                      'key_management_service_service-keys_dashboard_field_id',
                    )}
                  >
                    {/* TODO: use manager-component clipboard */}
                    <Clipboard value={kmsKey.id} />
                  </TileItem>
                  <TileSeparator />
                  <TileItem
                    title={t(
                      'key_management_service_service-keys_dashboard_field_state',
                    )}
                  >
                    <div className="flex justify-between">
                      <ServiceKeyStatus state={kmsKey.state} />
                      <ActionMenu
                        items={statusMenuItem}
                        isCompact
                        icon={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
                      />
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
                      options={{ dateStyle: 'long' }}
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
            </div>
          </>
        }
      />
      <Outlet />
    </Suspense>
  );
}
