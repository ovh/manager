import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsClipboard } from '@ovhcloud/ods-components/react';
import {
  DatagridColumn,
  Datagrid,
  useDataGrid,
  DataGridTextCell,
  ColumnSort,
} from '@ovhcloud/manager-components';
import { useVrackService, Subnet } from '@/data';
import { SubnetsActionCell } from './SubnetsActionCell.component';

const sortSubnets = (sorting: ColumnSort, subnetList: Subnet[] = []) => {
  subnetList.sort((s1, s2) => {
    switch (sorting.id) {
      case 'displayName':
        return s1.displayName?.localeCompare(s2.displayName);
      case 'cidr':
        return s1.cidr?.localeCompare(s2.cidr);
      case 'serviceRange':
        return s1.serviceRange?.cidr?.localeCompare(s2.serviceRange?.cidr);
      case 'vlan':
        return s1.vlan?.toString()?.localeCompare(s2.vlan?.toString());
      default:
        return 0;
    }
  });

  return sorting.desc ? subnetList.reverse() : subnetList;
};

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
      id: 'serviceRange',
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
      isSortable: false,
      cell: ({ cidr }) => <SubnetsActionCell cidr={cidr} vs={vs} />,
    },
  ];

  return (
    <Datagrid
      wrapperStyle={{ display: 'flex' }}
      tableStyle={{ minWidth: '700px' }}
      className="pb-[200px] -mx-6"
      columns={columns}
      items={sortSubnets(sorting, subnetList)}
      totalItems={subnetList.length}
      sorting={sorting}
      onSortChange={setSorting}
      noResultLabel={t('subnetsEmptyDataGridMessage')}
    />
  );
};
