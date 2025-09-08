import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import DashboardCardLayout from './DashboardCardLayout.component';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useDashboard } from '../hooks/useDashboard';
import { ActionsMenu } from '@/components/menu/ActionsMenu.component';
import NetworkItem from './network/NetworkItem.component';
import { DashboardTileBlock } from './DashboardTile.component';
import { useDedicatedUrl } from '@/hooks/url/useDedicatedUrl';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';
import ReverseDNS from './network/ReverseDNS.component';
import ExpandedNetwork from './network/ExpandedNetwork.component';

const InstanceNetworkingBlock: FC = () => {
  const { t } = useTranslation(['dashboard', 'list', 'actions']);
  const { region, instanceId } = useInstanceParams();
  const dedicatedUrl = useDedicatedUrl();
  const projectId = useProjectId();
  const projectUrl = useProjectUrl('public-cloud');

  const { instance, isPending: isInstanceLoading } = useDashboard({
    region,
    instanceId,
  });

  const publicIpActionsLinks = useMemo(() => {
    const ipV4 = instance?.publicNetwork.networks.find(
      (publicIp) => publicIp.version === 4,
    )?.ip;
    const ipParams = `ip=${ipV4}&ipBlock=${ipV4}`;

    return [
      {
        label: t('actions:pci_instances_actions_instance_network_change_dns'),
        link: {
          path: dedicatedUrl,
          isExternal: true,
          isTargetBlank: true,
        },
      },
      {
        label: t(
          'actions:pci_instances_actions_instance_network_activate_mitigation',
        ),
        link: {
          path: `${dedicatedUrl}?action=mitigation&${ipParams}&serviceName=${projectId}`,
          isExternal: true,
          isTargetBlank: true,
        },
      },
      {
        label: t(
          'actions:pci_instances_actions_instance_network_firewall_settings',
        ),
        link: {
          path: `${dedicatedUrl}?action=toggleFirewall&${ipParams}`,
          isExternal: true,
          isTargetBlank: true,
        },
      },
    ];
  }, [instance?.publicNetwork, dedicatedUrl, projectId, t]);

  const privateIpActionsLinks = useMemo(
    () =>
      instance?.isEditEnabled
        ? new Map([
            [
              'private_ip',
              [
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
            ],
          ])
        : new Map(),
    [projectUrl, t, instance?.isEditEnabled],
  );

  const expandedNetworks = instance?.privateNetwork.slice(2);

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_network_title')}>
      <DashboardTileBlock
        label={t('pci_instances_dashboard_public_network_title')}
        isLoading={isInstanceLoading}
      >
        {instance?.publicNetwork.networks.map((network) => (
          <NetworkItem
            key={network.ip}
            address={network}
            isFloatingIp={instance.publicNetwork.isFloatingIp}
            actions={publicIpActionsLinks}
          >
            <ReverseDNS ip={network.ip} />
          </NetworkItem>
        ))}
      </DashboardTileBlock>
      <DashboardTileBlock isLoading={isInstanceLoading} withoutDivider>
        <div className="flex items-center justify-between">
          <Text preset={TEXT_PRESET.heading6}>
            {t('pci_instances_dashboard_network_private_title')}
          </Text>
          <ActionsMenu
            actionButton={{ variant: 'ghost' }}
            items={privateIpActionsLinks}
          />
        </div>
        {instance?.privateNetwork.slice(0, 2).map((network) => (
          <NetworkItem key={network.ip} address={network} />
        ))}
        {expandedNetworks && <ExpandedNetwork networks={expandedNetworks} />}
      </DashboardTileBlock>
    </DashboardCardLayout>
  );
};

export default InstanceNetworkingBlock;
