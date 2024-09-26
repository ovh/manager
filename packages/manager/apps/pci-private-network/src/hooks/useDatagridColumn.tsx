import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { PRIVATE_NETWORK_LIST } from '@/constants';
import { TLocalZoneNetwork } from '@/api/hooks/useNetwork';
import DeleteAction from '@/components/local-zones/DeleteAction.component';

export const useDatagridColumn = (): DatagridColumn<TLocalZoneNetwork>[] => {
  const { t } = useTranslation('listing');
  return [
    {
      id: 'name',
      cell: (props: TLocalZoneNetwork) => (
        <DataGridTextCell>{props.name}</DataGridTextCell>
      ),
      label: t('pci_projects_project_network_private_name'),
    },
    {
      id: 'region',
      cell: (props: TLocalZoneNetwork) => (
        <DataGridTextCell>{props.region}</DataGridTextCell>
      ),
      label: t('pci_projects_project_network_private_region'),
    },
    {
      id: 'cidr',
      cell: (props: TLocalZoneNetwork) => (
        <DataGridTextCell>{props.cidr}</DataGridTextCell>
      ),
      label: PRIVATE_NETWORK_LIST.CIDR,
    },
    {
      id: 'gatewayIp',
      cell: (props: TLocalZoneNetwork) => (
        <DataGridTextCell>{props.gatewayIp}</DataGridTextCell>
      ),
      label: t('pci_projects_project_network_private_gateway'),
    },
    {
      id: 'dhcp',
      cell: (props: TLocalZoneNetwork) =>
        props.dhcpEnabled ? (
          <OsdsChip
            className="inline-flex m-3"
            color={ODS_THEME_COLOR_INTENT.success}
            size={ODS_CHIP_SIZE.sm}
          >
            {t('pci_projects_project_network_private_dhcp_active')}
          </OsdsChip>
        ) : (
          <OsdsChip
            className="inline-flex m-3"
            color={ODS_THEME_COLOR_INTENT.warning}
            size={ODS_CHIP_SIZE.sm}
          >
            {t('pci_projects_project_network_private_dhcp_disabled')}
          </OsdsChip>
        ),
      label: PRIVATE_NETWORK_LIST.DHCP,
    },
    {
      id: 'allocatedIp',
      cell: (props: TLocalZoneNetwork) => (
        <DataGridTextCell>{props.allocatedIp}</DataGridTextCell>
      ),
      label: t('pci_projects_project_network_private_ip_allocation'),
    },
    {
      id: 'actions',
      cell: (props: TLocalZoneNetwork) => (
        <DeleteAction networkId={props.id} region={props.region} />
      ),
      label: '',
    },
  ];
};
