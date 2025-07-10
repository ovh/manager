import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import { Clipboard, TileBlock } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import DashboardCardLayout from './DashboardCardLayout.component';
import StatusChip from '@/components/statusChip/StatusChip.component';
import { useParams } from '@/hooks/params/useParams';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useDashboard } from '../hooks/useDashboard';
import { LoadingCell } from '@/pages/instances/datagrid/components/cell/LoadingCell.component';
import {
  ActionsMenu,
  TActionsMenuItem,
} from '@/components/menu/ActionsMenu.component';

const InstanceNetworkingBlock: FC = () => {
  const { t } = useTranslation(['dashboard', 'list', 'actions']);
  const { regionId, instanceId } = useParams('regionId', 'instanceId');
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const [dedicatedUrl, setDedicatedUrl] = useState('');
  const projectId = useProjectId();

  const { instance, isPending: isInstanceLoading } = useDashboard({
    region: regionId,
    instanceId,
  });

  // TODO: verify if there is a best way to build this external url
  useEffect(() => {
    navigation
      .getURL('dedicated', '#/configuration/ip', {})
      .then((data) => setDedicatedUrl(data as string));
  }, [navigation]);

  const publicIPs = useMemo(
    () =>
      instance?.addresses.get('floating') ?? instance?.addresses.get('public'),
    [instance?.addresses],
  );

  const publicIpActionsLinks = useMemo(() => {
    const ipV4 = publicIPs?.find((publicIp) => publicIp.version === 4)?.ip;
    const ipParams = `ip=${ipV4}&ipBlock=${ipV4}`;
    const actions = new Map<string, TActionsMenuItem[]>();
    const menuItems = [
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

    return actions.set('action', menuItems);
  }, [publicIPs, dedicatedUrl, t]);

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_network_title')}>
      <LoadingCell isLoading={isInstanceLoading}>
        <TileBlock label={t('pci_instances_dashboard_public_network_title')}>
          {publicIPs?.map((publicIp) => (
            <div className="my-5" key={publicIp.ip}>
              <div className="flex items-center gap-x-4">
                <OsdsText
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  hue={ODS_THEME_COLOR_HUE._800}
                >
                  {publicIp.subnet?.name}
                </OsdsText>
                {instance?.addresses.get('floating') && (
                  <StatusChip
                    status={{
                      label: t(
                        'pci_instances_dashboard_network_floating_title',
                      ),
                      severity: 'warning',
                    }}
                  />
                )}
              </div>
              <div className="my-4">
                <OsdsText
                  size={ODS_TEXT_SIZE._200}
                  level={ODS_TEXT_LEVEL.heading}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  hue={ODS_THEME_COLOR_HUE._800}
                >
                  {t(`pci_instances_dashboard_network_ipv${publicIp.version}`)}
                </OsdsText>
                <div className="flex items-center justify-between">
                  <div className="w-[85%]">
                    <Clipboard value={publicIp.ip} />
                  </div>
                  <ActionsMenu items={publicIpActionsLinks} />
                </div>
              </div>
              {publicIp.subnet?.gatewayIP && (
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
                    <Clipboard value={publicIp.subnet.gatewayIP} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </TileBlock>
      </LoadingCell>
    </DashboardCardLayout>
  );
};

export default InstanceNetworkingBlock;
