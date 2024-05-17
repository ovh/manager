import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsClipboard } from '@ovhcloud/ods-components/react';
import {
  DatagridColumn,
  Datagrid,
  useDataGrid,
  DataGridTextCell,
} from '@ovhcloud/manager-components';
import { useVrackService, Subnet } from '@/api';
import ActionCell from './ActionCell';

export const SubnetDatagrid: React.FC = () => {
  const { t } = useTranslation('vrack-services/subnets');
  const { data: vs } = useVrackService();

  const { sorting, setSorting } = useDataGrid({
    id: 'displayName',
    desc: false,
  });

  const subnetList = vs?.currentState.subnets || [];

  const columns: DatagridColumn<Subnet>[] = [
    {
      id: 'displayName',
      label: t('subnetDatagridDisplayNameLabel'),
      cell: (subnet) => (
        <DataGridTextCell>{subnet?.displayName}</DataGridTextCell>
      ),
    },
    {
      id: 'cidr',
      label: t('subnetDatagridCidrLabel'),
      cell: ({ cidr }) => (
        <OsdsClipboard value={cidr} inline>
          <span slot="success-message">{t('copiedSuccessMessage')}</span>
        </OsdsClipboard>
      ),
    },
    {
      id: 'serviceRange.cidr',
      label: t('subnetDatagridServiceRangeLabel'),
      cell: ({ serviceRange }) => (
        <DataGridTextCell>{serviceRange.cidr}</DataGridTextCell>
      ),
    },
    {
      id: 'vlan',
      label: t('subnetDatagridVlanLabel'),
      cell: ({ vlan }) => <DataGridTextCell>{vlan}</DataGridTextCell>,
    },
    {
      id: 'actions',
      label: t('subnetDatagridActionsLabel'),
      cell: ({ cidr }) => <ActionCell cidr={cidr} vs={vs} />,
    },
  ];

  return (
    <Datagrid
      wrapperStyle={{ display: 'flex' }}
      tableStyle={{ minWidth: '700px' }}
      className="pb-[200px] -mx-6"
      columns={columns}
      items={subnetList}
      totalItems={subnetList.length}
      sorting={sorting}
      onSortChange={setSorting}
      noResultLabel={t('subnetsEmptyDataGridMessage')}
    />
  );
};

export default SubnetDatagrid;
