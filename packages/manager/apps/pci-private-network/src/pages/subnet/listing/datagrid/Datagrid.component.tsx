import { Datagrid, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsButton, OsdsChip, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_CHIP_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { TSubnet } from '@/types/network.type';
import DatagridActions from '@/components/datagrid-actions/DatagridActions.component';

const SubnetDataGrid: React.FC<{ data: TSubnet[] }> = ({ data }) => {
  const { t } = useTranslation(['listing', 'common']);

  const renderChip = (textKey: string, color: ODS_THEME_COLOR_INTENT) => (
    <OsdsChip className="inline-flex m-3" size={ODS_CHIP_SIZE.sm} color={color}>
      {t(textKey)}
    </OsdsChip>
  );

  const columns = [
    {
      id: 'subnetName',
      cell: ({ name }: TSubnet) => <DataGridTextCell>{name}</DataGridTextCell>,
      label: t('pci_projects_project_network_private_name'),
    },
    {
      id: 'region',
      cell: ({ region }: TSubnet) => (
        <DataGridTextCell>{region}</DataGridTextCell>
      ),
      label: t('pci_projects_project_network_private_region'),
    },
    {
      id: 'ipVersion',
      cell: ({ ipVersion }: TSubnet) => (
        <DataGridTextCell>{ipVersion}</DataGridTextCell>
      ),
      label: t('pci_projects_project_network_private_ip_version'),
    },
    {
      id: 'cidr',
      cell: ({ cidr }: TSubnet) => <DataGridTextCell>{cidr}</DataGridTextCell>,
      label: 'CIDR',
    },
    {
      id: 'dhcp',
      cell: ({ dhcpEnabled }: TSubnet) => (
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
      cell: ({ allocatedIp }: TSubnet) => (
        <DataGridTextCell>{allocatedIp}</DataGridTextCell>
      ),
      label: t('pci_projects_project_network_private_ip_allocation'),
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
                  >
                    <OsdsText
                      size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                      level={ODS_TEXT_LEVEL.button}
                      color={ODS_TEXT_COLOR_INTENT.primary}
                      slot={'start'}
                    >
                      {t('pci_projects_project_network_private_assign_gateway')}
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
                  >
                    <OsdsText
                      size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                      level={ODS_TEXT_LEVEL.button}
                      color={ODS_TEXT_COLOR_INTENT.primary}
                      slot={'start'}
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

  return <Datagrid columns={columns} items={data} totalItems={10} />;
};

export default SubnetDataGrid;
