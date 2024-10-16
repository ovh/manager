import {
  Notifications,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_DIVIDER_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SKELETON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsSkeleton,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Outlet, useHref, useParams } from 'react-router-dom';
import { useGetHealthMonitor } from '@/api/hook/useHealthMonitor';
import TileButton from '@/components/detail/pools/TileButton.component';
import TileLine from '@/components/detail/TileLine.component';
import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';
import { HEALTH_MONITOR_TYPE, LABELS } from '@/constants';

export default function HealthMonitor() {
  const { t } = useTranslation([
    'octavia-load-balancer-health-monitor',
    'octavia-load-balancer',
  ]);

  const { projectId, region, poolId } = useParams();

  const { data: healthMonitor, isPending } = useGetHealthMonitor({
    projectId,
    region,
    poolId,
  });

  return (
    <RedirectionGuard
      isLoading={isPending}
      condition={!isPending && !healthMonitor}
      route="create"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        <OsdsTile
          className="flex-col w-full shadow-custom-tile"
          rounded
          variant={ODS_TILE_VARIANT.flat}
        >
          <div className="flex flex-col w-full">
            <OsdsText
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
              className="mb-5"
            >
              {t(
                'octavia_load_balancer_health_monitor_overview_management_title',
              )}
            </OsdsText>
            <OsdsDivider separator size={ODS_DIVIDER_SIZE.zero} />

            <TileButton
              title={t(
                'octavia_load_balancer_health_monitor_overview_management_edit',
              )}
              href={useHref('./edit')}
            />
            <TileButton
              title={t(
                'octavia_load_balancer_health_monitor_overview_management_delete',
              )}
              href={useHref('./delete')}
            />
          </div>
        </OsdsTile>

        <OsdsTile
          className="flex-col w-full shadow-custom-tile"
          inline
          rounded
          variant={ODS_TILE_VARIANT.ghost}
        >
          <div className="flex flex-col w-full">
            <OsdsText
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('octavia_load_balancer_health_monitor_overview_info_title')}
            </OsdsText>

            <OsdsDivider separator />

            <TileLine
              title={t(
                'octavia_load_balancer_health_monitor_detail_overview_info_name',
              )}
              value={
                <div className="flex items-center gap-2 ">
                  <OsdsText
                    size={ODS_TEXT_SIZE._400}
                    level={ODS_TEXT_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {healthMonitor?.name}
                  </OsdsText>
                  <OsdsButton
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_BUTTON_SIZE.sm}
                    variant={ODS_BUTTON_VARIANT.ghost}
                    href=""
                  >
                    <OsdsIcon
                      size={ODS_ICON_SIZE.xxs}
                      name={ODS_ICON_NAME.PEN}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    />
                  </OsdsButton>
                </div>
              }
            />

            <TileLine
              title={t(
                'octavia_load_balancer_health_monitor_detail_overview_info_type',
              )}
              value={healthMonitor?.monitorType}
            />

            {[HEALTH_MONITOR_TYPE.HTTP, HEALTH_MONITOR_TYPE.HTTPS].includes(
              healthMonitor?.monitorType,
            ) && (
              <TileLine
                title={LABELS.URL_PATH}
                value={healthMonitor?.httpConfiguration?.urlPath}
              />
            )}

            {[HEALTH_MONITOR_TYPE.HTTP, HEALTH_MONITOR_TYPE.HTTPS].includes(
              healthMonitor?.monitorType,
            ) && (
              <TileLine
                title={t(
                  'octavia_load_balancer_health_monitor_detail_overview_info_expected_code',
                )}
                value={healthMonitor?.httpConfiguration?.expectedCodes}
              />
            )}

            <TileLine
              title={LABELS.MAX_RETRIES_DOWN}
              value={healthMonitor?.maxRetriesDown}
            />

            <TileLine title={LABELS.DELAY} value={healthMonitor?.delay} />

            <TileLine
              title={LABELS.MAX_RETRIES}
              value={healthMonitor?.maxRetries}
            />

            <TileLine title={LABELS.TIMEOUT} value={healthMonitor?.timeout} />

            <TileLine
              title={t(
                'octavia-load-balancer:octavia_load_balancer_provisioning_status',
              )}
              value={
                <div>
                  {healthMonitor?.provisioningStatus ? (
                    <ProvisioningStatusComponent
                      status={healthMonitor?.provisioningStatus}
                      className="w-fit"
                    />
                  ) : (
                    <OsdsSkeleton size={ODS_SKELETON_SIZE.lg} />
                  )}
                </div>
              }
            />
            <TileLine
              title={t(
                'octavia-load-balancer:octavia_load_balancer_operating_status',
              )}
              value={
                <div>
                  {healthMonitor?.operatingStatus ? (
                    <OperatingStatusComponent
                      status={healthMonitor?.operatingStatus}
                      className="w-fit"
                    />
                  ) : (
                    <OsdsSkeleton size={ODS_SKELETON_SIZE.lg} />
                  )}
                </div>
              }
            />
          </div>
        </OsdsTile>
      </div>

      <Outlet />
    </RedirectionGuard>
  );
}
