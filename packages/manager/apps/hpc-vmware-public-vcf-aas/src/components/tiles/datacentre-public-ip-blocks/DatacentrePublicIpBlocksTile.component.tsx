import { ActionMenu, DashboardTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';
import { OdsText, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useVcdVrackSegmentsList } from '@ovh-ux/manager-module-vcd-api';
import { getPublicIpBlockCount } from './datacentrePublicIpBlocksTileUtils';
import { subRoutes } from '@/routes/routes.constant';

export type DatacentrePublicIpBlocksTileProps = {
  id: string;
  vdcId: string;
};

export default function DatacentrePublicIpBlocksTile({
  id,
  vdcId,
}: DatacentrePublicIpBlocksTileProps) {
  const { t } = useTranslation('dashboard');

  const navigate = useNavigate();

  const { data: dataVrackSegment } = useVcdVrackSegmentsList(id, vdcId);

  return (
    <div className="h-fit">
      <DashboardTile
        title={t('managed_vcd_dashboard_tile_ip_block_title')}
        items={[
          {
            id: 'public_ip_blocks_number',
            label: t('managed_vcd_dashboard_tile_ip_block_label'),
            value: (
              <div className="flex justify-between items-center">
                <OdsText>
                  {dataVrackSegment ? (
                    getPublicIpBlockCount(dataVrackSegment.data)
                  ) : (
                    <OdsSkeleton className="w-full" />
                  )}
                </OdsText>
                <ActionMenu
                  id="license_menu"
                  isCompact
                  variant={ODS_BUTTON_VARIANT.ghost}
                  icon={ODS_ICON_NAME.ellipsisVertical}
                  items={[
                    {
                      id: 1,
                      label: t(
                        'managed_vcd_dashboard_tile_action_add_ip_block',
                      ),
                      onClick: () => {
                        navigate(subRoutes.addPublicIpBlock);
                      },
                    },
                    {
                      id: 2,
                      label: t(
                        'managed_vcd_dashboard_tile_action_manage_vrack_segments',
                      ),
                      onClick: () => {
                        navigate(subRoutes.vrackSegments);
                      },
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
