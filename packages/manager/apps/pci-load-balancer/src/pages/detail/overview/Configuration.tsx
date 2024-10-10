import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_SKELETON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OsdsDivider,
  OsdsSkeleton,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from '@/api/data/load-balancer';
import TileLine from '@/components/detail/TileLine.component';
import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';

export interface ConfigurationProps {
  loadBalancerProvisioningStatus: LoadBalancerProvisioningStatusEnum;
  loadBalancerOperatingStatus: LoadBalancerOperatingStatusEnum;
  flavorName: string;
  networkName: string;
  subnetCidr: string;
  loadBalancerVipAddress: string;
}

export default function Configuration({
  loadBalancerProvisioningStatus,
  loadBalancerOperatingStatus,
  flavorName,
  networkName,
  subnetCidr,
  loadBalancerVipAddress,
}: ConfigurationProps) {
  const { t: tOverview } = useTranslation('octavia_load_balancer_overview');
  const { t } = useTranslation('octavia-load-balancer');

  return (
    <div>
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
            {tOverview('octavia_load_balancer_overview_config_title')}
          </OsdsText>

          <OsdsDivider separator />

          <TileLine
            title={tOverview(
              'octavia_load_balancer_overview_config_provisioning_status',
            )}
            type="other"
            value={
              <div>
                {loadBalancerProvisioningStatus ? (
                  <ProvisioningStatusComponent
                    status={loadBalancerProvisioningStatus}
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
            type="other"
            value={
              <div>
                {loadBalancerOperatingStatus ? (
                  <OperatingStatusComponent
                    status={loadBalancerOperatingStatus}
                    className="w-fit"
                  />
                ) : (
                  <OsdsSkeleton size={ODS_SKELETON_SIZE.lg} />
                )}
              </div>
            }
          />

          <TileLine
            title={tOverview('octavia_load_balancer_overview_config_size')}
            value={
              flavorName
                ? tOverview(
                    `octavia_load_balancer_overview_config_size_${flavorName}`,
                  )
                : undefined
            }
          />

          <TileLine
            title={tOverview(
              'octavia_load_balancer_overview_config_private_network',
            )}
            value={networkName}
          />

          <TileLine
            title={tOverview('octavia_load_balancer_overview_config_subnet')}
            value={subnetCidr}
          />

          <TileLine
            title={tOverview(
              'octavia_load_balancer_overview_config_private_ip',
            )}
            value={loadBalancerVipAddress}
          />
        </div>
      </OsdsTile>
    </div>
  );
}
