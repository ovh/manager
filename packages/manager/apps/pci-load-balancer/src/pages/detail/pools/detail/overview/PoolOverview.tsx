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
import { useGetPool } from '@/api/hook/usePool';
import TileButton from '@/components/detail/pools/TileButton.component';
import TileLine from '@/components/detail/TileLine.component';
import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';

export default function PoolOverview() {
  const { t } = useTranslation('load-balancer');
  const { t: tPools } = useTranslation('pools');
  const { t: tPoolDetail } = useTranslation('pools/detail');
  const { t: tPoolOverview } = useTranslation('pools/overview');

  const { projectId, region, poolId } = useParams();

  const { data: pool } = useGetPool({
    projectId,
    region,
    poolId,
  });

  const hrefDeletePool = useHref(
    `./delete?poolId=${pool?.id}&poolName=${pool?.name}`,
  );
  const hrefEditPool = useHref(`../edit`);

  return (
    <>
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
              {tPoolOverview(
                'octavia_load_balancer_pools_detail_overview_management_title',
              )}
            </OsdsText>
            <OsdsDivider separator size={ODS_DIVIDER_SIZE.zero} />

            <TileButton
              title={tPoolOverview(
                'octavia_load_balancer_pools_detail_overview_management_edit',
              )}
              href={hrefEditPool}
              dataTestId="clusterManagement-edit"
            />
            <TileButton
              title={tPoolOverview(
                'octavia_load_balancer_pools_detail_overview_management_add_manually',
              )}
              href=""
            />
            <TileButton
              title={tPoolDetail(
                'octavia_load_balancer_pools_detail_add_ips_instances',
              )}
              href=""
            />
            <TileButton
              title={tPoolOverview(
                'octavia_load_balancer_pools_detail_overview_management_delete',
              )}
              href={hrefDeletePool}
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
              {tPoolOverview(
                'octavia_load_balancer_pools_detail_overview_info_title',
              )}
            </OsdsText>

            <OsdsDivider separator />

            <TileLine
              title={tPoolOverview(
                'octavia_load_balancer_pools_detail_overview_info_name',
              )}
              value={
                <div className="flex items-center gap-2 ">
                  <OsdsText
                    size={ODS_TEXT_SIZE._400}
                    level={ODS_TEXT_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {pool?.name}
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
              title={tPoolOverview(
                'octavia_load_balancer_pools_detail_overview_info_pool_id',
              )}
              type="clipboard"
              value={pool?.id}
            />

            {pool?.listenerId && (
              <TileLine
                title={tPoolOverview(
                  'octavia_load_balancer_pools_detail_overview_info_listener_id',
                )}
                type="clipboard"
                value={pool?.listenerId}
              />
            )}

            <TileLine
              title={tPoolOverview(
                'octavia_load_balancer_pools_detail_overview_info_provisioning_status',
              )}
              value={
                <div>
                  {pool?.provisioningStatus ? (
                    <ProvisioningStatusComponent
                      status={pool?.provisioningStatus}
                      className="w-fit"
                    />
                  ) : (
                    <OsdsSkeleton size={ODS_SKELETON_SIZE.lg} />
                  )}
                </div>
              }
            />
            <TileLine
              title={t('octavia_load_balancer_operating_status')}
              value={
                <div>
                  {pool?.operatingStatus ? (
                    <OperatingStatusComponent
                      status={pool?.operatingStatus}
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
              {tPoolOverview(
                'octavia_load_balancer_pools_detail_overview_options_title',
              )}
            </OsdsText>

            <OsdsDivider separator />

            <TileLine
              title={tPoolOverview(
                'octavia_load_balancer_pools_detail_overview_options_algorithm',
              )}
              value={tPools(
                `octavia_load_balancer_pools_enum_algorithm_${pool?.algorithm}`,
              )}
            />

            <TileLine
              title={tPoolOverview(
                'octavia_load_balancer_pools_detail_overview_options_protocol',
              )}
              value={pool?.protocol}
            />

            <TileLine
              title={tPoolOverview(
                'octavia_load_balancer_pools_detail_overview_session_persistence',
              )}
              value={
                pool?.sessionPersistence?.type === 'disabled'
                  ? tPoolOverview(
                      'octavia_load_balancer_pools_detail_overview_session_persistence_disabled',
                    )
                  : pool?.sessionPersistence?.type
              }
            />

            {pool?.sessionPersistence?.type !== 'disabled' && (
              <TileLine
                title={tPoolOverview(
                  'octavia_load_balancer_pools_detail_overview_cookie_name',
                )}
                type="other"
                value={
                  <OsdsText
                    className="mb-4"
                    size={ODS_TEXT_SIZE._400}
                    level={ODS_TEXT_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {pool?.sessionPersistence?.cookieName}
                  </OsdsText>
                }
              />
            )}
          </div>
        </OsdsTile>
      </div>

      <Outlet />
    </>
  );
}
