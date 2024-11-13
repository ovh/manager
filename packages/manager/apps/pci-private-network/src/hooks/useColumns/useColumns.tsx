import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import {
  OsdsButton,
  OsdsChip,
  OsdsIcon,
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import DatagridActions from '@/components/datagrid-actions/DatagridActions.component';
import { TGroupedNetwork, TGroupedSubnet } from '@/types/network.type';

export function usePrivateNetworkRegionColumns() {
  const { t } = useTranslation(['listing', 'common']);

  return useMemo(
    () => [
      {
        id: 'name',
        cell: ({ name }: TGroupedNetwork) => (
          <DataGridTextCell>{name}</DataGridTextCell>
        ),
        label: t('pci_projects_project_network_private_name'),
      },
      {
        id: 'region',
        cell: ({ regions }: TGroupedNetwork) => (
          <DataGridTextCell>{regions}</DataGridTextCell>
        ),
        label: t('pci_projects_project_network_private_region'),
      },
      {
        id: 'vlanId',
        cell: ({ vlanId }: TGroupedNetwork) => (
          <DataGridTextCell>{vlanId}</DataGridTextCell>
        ),
        label: t('pci_projects_project_network_private_vlan_id'),
      },
      {
        id: 'actions',
        cell: () => (
          <DataGridTextCell>
            <DatagridActions
              actions={[
                {
                  id: 1,
                  content: (
                    <OsdsButton
                      size={ODS_BUTTON_SIZE.sm}
                      variant={ODS_BUTTON_VARIANT.ghost}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      disabled
                    >
                      <OsdsText
                        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                        level={ODS_TEXT_LEVEL.button}
                        color={ODS_TEXT_COLOR_INTENT.primary}
                        slot="start"
                      >
                        {t(
                          'pci_projects_project_network_private_subnet_create',
                        )}
                      </OsdsText>
                    </OsdsButton>
                  ),
                },
                {
                  id: 2,
                  content: (
                    <OsdsButton
                      size={ODS_BUTTON_SIZE.sm}
                      variant={ODS_BUTTON_VARIANT.ghost}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      disabled
                    >
                      <OsdsText
                        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                        level={ODS_TEXT_LEVEL.button}
                        color={ODS_TEXT_COLOR_INTENT.primary}
                        slot="start"
                      >
                        {t('pci_projects_project_network_private_subnet_show')}
                      </OsdsText>
                    </OsdsButton>
                  ),
                },
                {
                  id: 3,
                  content: (
                    <OsdsButton
                      size={ODS_BUTTON_SIZE.sm}
                      variant={ODS_BUTTON_VARIANT.ghost}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      disabled
                    >
                      <OsdsText
                        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                        level={ODS_TEXT_LEVEL.button}
                        color={ODS_TEXT_COLOR_INTENT.primary}
                        slot="start"
                      >
                        {t('pci_projects_project_network_private_delete')}
                      </OsdsText>
                    </OsdsButton>
                  ),
                },
              ]}
            />
          </DataGridTextCell>
        ),
        label: t('pci_projects_project_network_private_action'),
      },
    ],
    [],
  );
}

export function usePrivateNetworkLZColumns() {
  const { t } = useTranslation(['listing', 'common']);

  const renderChip = (textKey: string, color: ODS_THEME_COLOR_INTENT) => (
    <OsdsChip className="inline-flex m-3" size={ODS_CHIP_SIZE.sm} color={color}>
      {t(textKey)}
    </OsdsChip>
  );

  return useMemo(
    () => [
      {
        id: 'name',
        cell: ({ name }: TGroupedSubnet) => (
          <DataGridTextCell>{name}</DataGridTextCell>
        ),
        label: t('pci_projects_project_network_private_name'),
      },
      {
        id: 'region',
        cell: ({ region }: TGroupedSubnet) => (
          <DataGridTextCell>{region}</DataGridTextCell>
        ),
        label: t('pci_projects_project_network_private_region'),
      },
      {
        id: 'cidr',
        cell: ({ cidr }: TGroupedSubnet) => (
          <DataGridTextCell>{cidr}</DataGridTextCell>
        ),
        label: 'CIDR',
      },
      {
        id: 'gatewayIp',
        cell: ({ gatewayIp }: TGroupedSubnet) => (
          <DataGridTextCell>{gatewayIp}</DataGridTextCell>
        ),
        label: t('pci_projects_project_network_private_gateway'),
      },
      {
        id: 'dhcp',
        cell: ({ dhcpEnabled }: TGroupedSubnet) => (
          <DataGridTextCell>
            {dhcpEnabled
              ? renderChip(
                  'pci_projects_project_network_private_dhcp_active',
                  ODS_THEME_COLOR_INTENT.success,
                )
              : renderChip(
                  'pci_projects_project_network_private_dhcp_disabled',
                  ODS_THEME_COLOR_INTENT.warning,
                )}
          </DataGridTextCell>
        ),
        label: 'DHCP',
      },
      {
        id: 'ip_allocation',
        cell: ({ allocatedIp }: TGroupedSubnet) => (
          <DataGridTextCell>{allocatedIp}</DataGridTextCell>
        ),
        label: t('pci_projects_project_network_private_ip_allocation'),
      },
      {
        id: 'actions',
        cell: () => (
          <div>
            <OsdsTooltip>
              <OsdsButton
                size={ODS_BUTTON_SIZE.sm}
                variant={ODS_BUTTON_VARIANT.ghost}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                <OsdsIcon
                  name={ODS_ICON_NAME.BIN}
                  size={ODS_ICON_SIZE.xs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
              </OsdsButton>
              <OsdsTooltipContent slot="tooltip-content">
                {t('pci_projects_project_network_private_delete')}
              </OsdsTooltipContent>
            </OsdsTooltip>
          </div>
        ),
        label: t('pci_projects_project_network_private_action'),
      },
    ],
    [],
  );
}
