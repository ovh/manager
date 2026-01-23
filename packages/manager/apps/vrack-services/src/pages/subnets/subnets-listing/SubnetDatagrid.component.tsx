import React, { useState } from 'react';

import type { ColumnSort } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import type { Subnet } from '@ovh-ux/manager-network-common';
import { useVrackService } from '@ovh-ux/manager-network-common';
import { Clipboard, Datagrid } from '@ovh-ux/muk';
import type { DatagridColumn } from '@ovh-ux/muk';

import { TRANSLATION_NAMESPACES } from '@/utils/constants';

import { SubnetsActionCell } from './SubnetsActionCell.component';

const sortSubnets = (sorting: ColumnSort, subnetList: Subnet[] = []) => {
  subnetList.sort((s1, s2) => {
    switch (sorting?.id ?? '') {
      case 'displayName':
        return (s1.displayName || '').localeCompare(s2.displayName || '');
      case 'cidr':
        return (s1.cidr || '').localeCompare(s2.cidr || '');
      case 'serviceRange':
        return (s1.serviceRange?.cidr || '').localeCompare(s2.serviceRange?.cidr || '');
      case 'vlan':
        return (s1.vlan?.toString() || '').localeCompare(s2.vlan?.toString() || '');
      default:
        return 0;
    }
  });

  return sorting?.desc ? subnetList.reverse() : subnetList;
};

export const SubnetDatagrid: React.FC = () => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.subnets, NAMESPACES.DASHBOARD]);
  const { data: vs } = useVrackService();

  const [sorting, setSorting] = useState<ColumnSort[]>([
    {
      id: 'managedServiceURN',
      desc: false,
    },
  ]);

  const subnetList = vs?.currentState.subnets || [];

  const columns: DatagridColumn<Subnet>[] = [
    {
      id: 'displayName',
      header: t('subnetDatagridDisplayNameLabel'),
      label: t('subnetDatagridDisplayNameLabel'),
      accessorKey: 'displayName',
      isSortable: true,
      cell: (cellContext) => (
        <Text>
          {cellContext.row.original?.displayName ?? t('none', { ns: NAMESPACES.DASHBOARD })}
        </Text>
      ),
    },
    {
      id: 'cidr',
      header: t('subnetDatagridCidrLabel'),
      label: t('subnetDatagridCidrLabel'),
      accessorKey: 'cidr',
      isSortable: true,
      cell: (cellContext) => <Clipboard value={cellContext.row.original.cidr} />,
    },
    {
      id: 'serviceRange',
      header: t('subnetDatagridServiceRangeLabel'),
      label: t('subnetDatagridServiceRangeLabel'),
      accessorKey: 'serviceRange.cidr',
      isSortable: true,
      minSize: 220,
      cell: (cellContext) => <Text>{cellContext.row.original.serviceRange.cidr}</Text>,
    },
    {
      id: 'vlan',
      header: t('subnetDatagridVlanLabel'),
      label: t('subnetDatagridVlanLabel'),
      accessorKey: 'vlan',
      isSortable: true,
      maxSize: 50,
      cell: (cellContext) => <Text>{cellContext.row.original.vlan}</Text>,
    },
    {
      id: 'actions',
      header: t('subnetDatagridActionsLabel'),
      label: t('subnetDatagridActionsLabel'),
      isSortable: false,
      enableHiding: false,
      maxSize: 50,
      minSize: 50,
      cell: (cellContext) => {
        if (!vs) {
          return null;
        }
        return <SubnetsActionCell cidr={cellContext.row.original.cidr} vs={vs} />;
      },
    },
  ];

  return (
    <Datagrid
      // wrapperStyle={{ display: 'flex' }}
      // tableStyle={{ minWidth: '700px' }}
      columns={columns}
      data={sortSubnets(sorting[0] || { id: 'displayName', desc: false }, subnetList)}
      totalCount={subnetList.length}
      sorting={{
        sorting,
        setSorting,
        manualSorting: true,
      }}
    />
  );
};
