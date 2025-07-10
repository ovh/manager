import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
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
import { useParam } from '@ovh-ux/manager-pci-common';
import DashboardCardLayout from './DashboardCardLayout.component';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useDashboard } from '../hooks/useDashboard';
import { LoadingCell } from '@/pages/instances/datagrid/components/cell/LoadingCell.component';
import { BaseActionsMenu } from '@/components/menu/ActionsMenu.component';
import NetworkItem from './NetworkItem.component';
import { DashboardTileBlock } from './DashboardTile.component';
import { useDedicatedUrl } from '@/hooks/url/useDedicatedUrl';

const InstanceNetworkingBlock: FC = () => {
  const { t } = useTranslation(['dashboard', 'list', 'actions']);
  const { regionId, instanceId } = useParam('regionId', 'instanceId');
  const dedicatedUrl = useDedicatedUrl();
  const projectId = useProjectId();
  const projectUrl = useProjectUrl('public-cloud');

  const { instance, isPending: isInstanceLoading } = useDashboard({
    region: regionId,
    instanceId,
  });

  const publicIPs = useMemo(
    () =>
      instance?.addresses.get('floating') ?? instance?.addresses.get('public'),
    [instance?.addresses],
  );

  const publicIpActionsLinks = useMemo(() => {
    const ipV4 = publicIPs?.find((publicIp) => publicIp.version === 4)?.ip;
    const ipParams = `ip=${ipV4}&ipBlock=${ipV4}`;

    return [
      {
        label: t('actions:pci_instances_actions_instance_network_change_dns'),
        link: {
          path: dedicatedUrl,
          isExternal: true,
        },
      },
      {
        label: t(
          'actions:pci_instances_actions_instance_network_activate_mitigation',
        ),
        link: {
          path: `${dedicatedUrl}?action=mitigation&${ipParams}&serviceName=${projectId}`,
          isExternal: true,
        },
      },
      {
        label: t(
          'actions:pci_instances_actions_instance_network_firewall_settings',
        ),
        link: {
          path: `${dedicatedUrl}?action=toggleFirewall&${ipParams}`,
          isExternal: true,
        },
      },
    ];
  }, [publicIPs, dedicatedUrl, t]);

  const privateIps = useMemo(() => instance?.addresses.get('private'), [
    instance?.addresses,
  ]);

  const privateIpActionsLinks = useMemo(
    () => [
      {
        label: t(
          'actions:pci_instances_actions_instance_network_network_settings',
        ),
        link: {
          path: `${projectUrl}/private-networks`,
          isExternal: true,
        },
      },
      {
        label: t(
          'actions:pci_instances_actions_instance_network_network_attach',
        ),
        link: {
          path: 'network/private/attach',
          isExternal: false,
        },
      },
    ],
    [projectUrl, t],
  );

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_network_title')}>
      <DashboardTileBlock
        label={t('pci_instances_dashboard_public_network_title')}
        isLoading={isInstanceLoading}
      >
        {publicIPs?.map((publicIp) => (
          <NetworkItem
            key={publicIp.ip}
            address={publicIp}
            isFloatingIp={!!instance?.addresses.get('floating')}
            actions={publicIpActionsLinks}
          />
        ))}
      </DashboardTileBlock>
      <LoadingCell isLoading={isInstanceLoading}>
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
            <BaseActionsMenu items={privateIpActionsLinks} />
          </div>
          {privateIps?.map((privateIp) => (
            <NetworkItem key={privateIp.ip} address={privateIp} />
          ))}
          <OsdsDivider separator size={ODS_DIVIDER_SIZE.six} />
        </div>
      </LoadingCell>
    </DashboardCardLayout>
  );
};

export default InstanceNetworkingBlock;
