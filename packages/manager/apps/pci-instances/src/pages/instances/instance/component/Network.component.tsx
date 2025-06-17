import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import { Clipboard, TileBlock } from '@ovh-ux/manager-react-components';
import DashboardCardLayout from './DashboardCardLayout.component';
import { InstanceDetailContext } from '../Instance.page';
import StatusChip from '@/components/statusChip/StatusChip.component';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';
import BaseActionsMenu from '@/components/menu/BaseActionsMenu.component';

const Network: FC = () => {
  const { t } = useTranslation(['dashboard', 'list']);
  const { data: instance, isLoading } = useContext(InstanceDetailContext);

  const publicIPs = instance.networks.get('public');

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_network_title')}>
      <LoadingCell isLoading={isLoading}>
        <TileBlock label={t('pci_instances_dashboard_public_network_title')}>
          {publicIPs?.map(({ ip, name, flag, version, gatewayIp, actions }) => (
            <div className="my-5" key={ip}>
              <div className="flex items-center gap-x-4">
                <OsdsText
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  hue={ODS_THEME_COLOR_HUE._800}
                >
                  {name}
                </OsdsText>
                {flag && (
                  <StatusChip status={{ label: flag, severity: 'warning' }} />
                )}
              </div>
              <div className="my-4">
                <OsdsText
                  size={ODS_TEXT_SIZE._200}
                  level={ODS_TEXT_LEVEL.heading}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  hue={ODS_THEME_COLOR_HUE._800}
                >
                  {t(`pci_instances_dashboard_network_ipv${version}`)}
                </OsdsText>
                <div className="flex items-center justify-between">
                  <div className="w-[85%]">
                    <Clipboard value={ip} />
                  </div>
                  <BaseActionsMenu items={actions} />
                </div>
              </div>
              {gatewayIp && (
                <div className="my-4">
                  <OsdsText
                    size={ODS_TEXT_SIZE._200}
                    level={ODS_TEXT_LEVEL.heading}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    hue={ODS_THEME_COLOR_HUE._800}
                  >
                    {t('pci_instances_dashboard_network_gateway')}
                  </OsdsText>
                  <div className="w-[85%]">
                    <Clipboard value={gatewayIp} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </TileBlock>
      </LoadingCell>
      {/* {networks.map(({ type, label, value, gateway, dns }) => (
        <Fragment key={type}>
          <TileBlock label={label}>
            <Clipboard value={value} />
            <div className="my-5">
              <OsdsText
                size={ODS_TEXT_SIZE._200}
                level={ODS_TEXT_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.primary}
                hue={ODS_THEME_COLOR_HUE._800}
              >
                {t('pci_instances_dashboard_network_gateway')}
              </OsdsText>
              <Clipboard value={gateway} />
            </div>
            <div className="flex flex-col">
              <OsdsText
                size={ODS_TEXT_SIZE._200}
                level={ODS_TEXT_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.primary}
                hue={ODS_THEME_COLOR_HUE._800}
              >
                {t('pci_instances_dashboard_network_dns')}
              </OsdsText>
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {dns}
              </OsdsText>
            </div>
          </TileBlock>
        </Fragment>
      ))}
      <TileBlock label={t('pci_instances_dashboard_network_private')}>
        <OsdsText
          className="my-4"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          -
        </OsdsText>
      </TileBlock> */}
    </DashboardCardLayout>
  );
};

export default Network;
