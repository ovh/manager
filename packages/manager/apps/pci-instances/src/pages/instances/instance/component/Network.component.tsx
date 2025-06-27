import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsDivider, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_SIZE,
  ODS_TEXT_LEVEL,
  ODS_DIVIDER_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import {
  Clipboard,
  TileBlock,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import clsx from 'clsx';
import DashboardCardLayout from './DashboardCardLayout.component';
import { InstanceDetailContext } from '../Instance.page';
import StatusChip from '@/components/statusChip/StatusChip.component';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';
import BaseActionsMenu from '@/components/menu/BaseActionsMenu.component';
import { TNetwork } from '@/types/instance/entity.type';
import { DeepReadonly } from '@/types/utils.type';
import { TBaseAction } from '@/types/instance/action/action.type';

const NetworkItem: FC<DeepReadonly<TNetwork>> = ({
  name,
  ip,
  flag,
  version,
  actions,
  gatewayIp,
}) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="my-5">
      <div className="flex items-center gap-x-4">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.primary}
          hue={ODS_THEME_COLOR_HUE._800}
        >
          {name}
        </OsdsText>
        {flag && <StatusChip status={{ label: flag, severity: 'warning' }} />}
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
        <div
          className={clsx(
            actions.length > 0 && 'flex items-center justify-between',
          )}
        >
          <div className={clsx({ 'w-[85%]': actions.length > 0 })}>
            <Clipboard value={ip} />
          </div>
          {actions.length > 0 && <BaseActionsMenu items={actions} />}
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
          <div className={clsx({ 'w-[85%]': actions.length > 0 })}>
            <Clipboard value={gatewayIp} />
          </div>
        </div>
      )}
    </div>
  );
};

const Network: FC = () => {
  const { t } = useTranslation(['dashboard', 'list', 'actions']);
  const { data: instance, isLoading } = useContext(InstanceDetailContext);

  const publicIPs = instance.networks.get('public');
  const privateIps = instance.networks.get('private');
  const projectUrl = useProjectUrl('public-cloud');

  const privateNetworkActions: TBaseAction[] = [
    {
      label: t(
        'actions:pci_instances_actions_instance_network_network_settings',
      ),
      link: {
        path: `${projectUrl}/private-networks`,
        isExternal: true,
        target: 'self',
      },
    },
    {
      label: t('actions:pci_instances_actions_instance_network_network_attach'),
      link: {
        path: 'attach-network',
        isExternal: false,
        target: 'self',
      },
    },
  ];

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_network_title')}>
      <LoadingCell isLoading={isLoading}>
        <TileBlock label={t('pci_instances_dashboard_public_network_title')}>
          {publicIPs?.map((publicIp) => (
            <NetworkItem key={publicIp.ip} {...publicIp} />
          ))}
        </TileBlock>
        <LoadingCell isLoading={isLoading}>
          <div className="flex flex-col mb-3">
            <div className="flex items-center justify-between">
              <OsdsText
                level={ODS_TEXT_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.primary}
                hue={ODS_THEME_COLOR_HUE._800}
                size={ODS_TEXT_SIZE._200}
              >
                {t('pci_instances_dashboard_network_private_title')}
              </OsdsText>
              <BaseActionsMenu items={privateNetworkActions} />
            </div>
            {privateIps?.map((privateIp) => (
              <NetworkItem key={privateIp.ip} {...privateIp} />
            ))}
            <OsdsDivider separator size={ODS_DIVIDER_SIZE.six} />
          </div>
        </LoadingCell>
      </LoadingCell>
    </DashboardCardLayout>
  );
};

export default Network;
