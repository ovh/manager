import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_SKELETON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import { OsdsDivider, OsdsSkeleton, OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import { Button, Icon, Text } from '@ovhcloud/ods-react';

import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from '@/api/data/load-balancer';
import TileLine from '@/components/detail/TileLine.component';
import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';

import ResizeLoadBalancerDrawer from './ResizeLoadBalancerDrawer.component';

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
  const { t } = useTranslation(['load-balancer/overview', 'load-balancer']);
  const [isResizeDrawerOpen, setIsResizeDrawerOpen] = useState(false);

  const handleOpenResizeDrawer = () => {
    setIsResizeDrawerOpen(true);
  };

  const handleCloseResizeDrawer = () => {
    setIsResizeDrawerOpen(false);
  };

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
            {t('load-balancer/overview:octavia_load_balancer_overview_config_title')}
          </OsdsText>

          <OsdsDivider separator />

          <TileLine
            title={t(
              'load-balancer/overview:octavia_load_balancer_overview_config_provisioning_status',
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
            title={t('load-balancer:octavia_load_balancer_operating_status')}
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

          {flavorName && (
            <TileLine
              title={t('load-balancer/overview:octavia_load_balancer_overview_config_size')}
              type="other"
              value={
                <div className="flex flex-col">
                  <Text>
                    {t(
                      `load-balancer/overview:octavia_load_balancer_overview_config_size_${flavorName}`,
                    )}
                  </Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit p-0 text-left hover:bg-transparent"
                    onClick={handleOpenResizeDrawer}
                  >
                    {t('load-balancer/overview:octavia_load_balancer_overview_config_modify_size')}
                    <Icon name="arrow-right" />
                  </Button>
                </div>
              }
            />
          )}

          <ResizeLoadBalancerDrawer
            isOpen={isResizeDrawerOpen}
            onDismiss={handleCloseResizeDrawer}
          />

          <TileLine
            title={t(
              'load-balancer/overview:octavia_load_balancer_overview_config_private_network',
            )}
            value={networkName}
          />

          <TileLine
            title={t('load-balancer/overview:octavia_load_balancer_overview_config_subnet')}
            value={subnetCidr}
          />

          <TileLine
            title={t('load-balancer/overview:octavia_load_balancer_overview_config_private_ip')}
            value={loadBalancerVipAddress}
          />
        </div>
      </OsdsTile>
    </div>
  );
}
