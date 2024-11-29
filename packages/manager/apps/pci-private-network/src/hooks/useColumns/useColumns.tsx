import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
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
import {
  ResourceStatus,
  TGroupedNetwork,
  TGroupedSubnet,
} from '@/types/network.type';
import SlicedRegions from '@/components/sliced-regions/SlicedRegions.component';
import StatusInfo from '@/components/status-info/StatusInfo.component';
import SkeletonWrapper from '@/components/skeleton/SkeletonWrapper.component';

export function usePrivateNetworkRegionColumns() {
  const { t } = useTranslation(['listing', 'common']);

  return [
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
        <DataGridTextCell>
          <SlicedRegions regions={regions} length={3} />
        </DataGridTextCell>
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
                      {t('pci_projects_project_network_private_subnet_create')}
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
  ];
}

type LZColumns = TGroupedSubnet & { isPending: boolean };

export function usePrivateNetworkLZColumns() {
  const { t } = useTranslation(['listing', 'common']);
  const navigate = useNavigate();

  return [
    {
      id: 'name',
      cell: ({ name }: LZColumns) => (
        <DataGridTextCell>{name}</DataGridTextCell>
      ),
      label: t('pci_projects_project_network_private_name'),
    },
    {
      id: 'region',
      cell: ({ region }: LZColumns) => (
        <DataGridTextCell>{region}</DataGridTextCell>
      ),
      label: t('pci_projects_project_network_private_region'),
    },
    {
      id: 'cidr',
      cell: ({ cidr, isPending }: LZColumns) => (
        <SkeletonWrapper isPending={isPending}>
          <DataGridTextCell>{cidr}</DataGridTextCell>
        </SkeletonWrapper>
      ),
      label: 'CIDR',
    },
    {
      id: 'gatewayIp',
      cell: ({ gatewayIp, isPending }: LZColumns) => (
        <SkeletonWrapper isPending={isPending}>
          <DataGridTextCell>{gatewayIp}</DataGridTextCell>
        </SkeletonWrapper>
      ),
      label: t('pci_projects_project_network_private_gateway'),
    },
    {
      id: 'dhcp',
      cell: ({ dhcpEnabled, isPending }: LZColumns) => (
        <SkeletonWrapper isPending={isPending}>
          <DataGridTextCell>
            <StatusInfo
              label={
                dhcpEnabled ? ResourceStatus.ACTIVE : ResourceStatus.DISABLED
              }
            />
          </DataGridTextCell>
        </SkeletonWrapper>
      ),
      label: 'DHCP',
    },
    {
      id: 'ip_allocation',
      cell: ({ allocatedIp, isPending }: LZColumns) => (
        <SkeletonWrapper isPending={isPending}>
          <DataGridTextCell>{allocatedIp}</DataGridTextCell>
        </SkeletonWrapper>
      ),
      label: t('pci_projects_project_network_private_ip_allocation'),
    },
    {
      id: 'actions',
      cell: ({ region, networkId }: LZColumns) => (
        <div>
          <OsdsTooltip>
            <OsdsButton
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() =>
                navigate(`./delete?networkId=${networkId}&region=${region}`)
              }
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
  ];
}
