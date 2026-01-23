import React, { useState } from 'react';

import type { ColumnSort } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { useVrackServicesList } from '@ovh-ux/manager-network-common';
import type { VrackServicesWithIAM } from '@ovh-ux/manager-network-common';
import { ovhLocaleToI18next } from '@ovh-ux/manager-react-shell-client';
import { Datagrid } from '@ovh-ux/muk';
import type { DatagridColumn } from '@ovh-ux/muk';

import { DisplayName } from '@/components/display-name/DisplayName.component';
import { ProductStatusChip } from '@/components/product-status-chip/ProductStatusChip.component';
import { VrackId } from '@/components/vrack-id/VrackId.component';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { getDisplayName } from '@/utils/vrack-services';

import { ActionCell } from './ActionCell.component';

const sortVrackServicesListing = (
  sorting: ColumnSort,
  originalList: VrackServicesWithIAM[] = [],
) => {
  const vsList = [...originalList];
  vsList.sort((vs1, vs2) => {
    switch (sorting?.id ?? '') {
      case 'displayName':
        return (getDisplayName(vs1) || '').localeCompare(getDisplayName(vs2) || '');
      case 'createdAt':
        return (vs1.createdAt || '').localeCompare(vs2.createdAt || '');
      case 'productStatus':
        return (vs1.currentState.productStatus || '').localeCompare(
          vs2.currentState.productStatus || '',
        );
      case 'region':
        return (vs1.currentState.region || '').localeCompare(vs2.currentState.region || '');
      case 'vrackId':
        return (vs1.currentState.vrackId || '').localeCompare(vs2.currentState.vrackId || '');
      default:
        return 0;
    }
  });

  return sorting?.desc ? vsList.reverse() : vsList;
};

export const VrackServicesDatagrid: React.FC = () => {
  const { t, i18n } = useTranslation(TRANSLATION_NAMESPACES.listing);

  const { data } = useVrackServicesList();
  const [sorting, setSorting] = useState<ColumnSort[]>([
    {
      id: 'displayName',
      desc: false,
    },
  ]);

  const columns: DatagridColumn<VrackServicesWithIAM>[] = [
    {
      id: 'displayName',
      header: t('displayName'),
      label: t('displayName'),
      accessorKey: 'id',
      isSortable: true,
      enableHiding: false,
      cell: (cellContext) => <DisplayName {...cellContext.row.original} isListing />,
    },
    {
      id: 'productStatus',
      header: t('productStatus'),
      label: t('productStatus'),
      accessorKey: 'productStatus',
      isSortable: true,
      enableHiding: false,
      cell: (cellContext) => (
        <ProductStatusChip productStatus={cellContext.row.original.currentState.productStatus} />
      ),
    },
    {
      id: 'region',
      header: t('region'),
      label: t('region'),
      accessorKey: 'region',
      isSortable: true,
      enableHiding: false,
      cell: (cellContext) => <Text>{t(cellContext.row.original.currentState.region)}</Text>,
    },
    {
      id: 'vrackId',
      header: t('vrackId'),
      label: t('vrackId'),
      accessorKey: 'vrackId',
      isSortable: true,
      enableHiding: false,
      cell: (cellContext) => <VrackId isListing {...cellContext.row.original} />,
    },
    {
      id: 'createdAt',
      header: t('createdAt'),
      label: t('createdAt'),
      accessorKey: 'createdAt',
      isSortable: true,
      enableHiding: false,
      cell: (cellContext) => {
        const date = new Date(cellContext.row.original.createdAt);
        return (
          <Text>
            {date.toString() !== 'Invalid Date'
              ? date.toLocaleDateString(ovhLocaleToI18next(i18n.language))
              : '-'}
          </Text>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      label: '',
      isSortable: false,
      enableHiding: false,
      maxSize: 50,
      minSize: 50,
      cell: (cellContext) => <ActionCell {...cellContext.row.original} />,
    },
  ];

  return data?.data.length ? (
    <Datagrid
      sorting={{
        sorting,
        setSorting,
        manualSorting: true,
      }}
      columns={columns}
      data={sortVrackServicesListing(sorting[0] || { id: 'displayName', desc: false }, data?.data)}
      totalCount={data?.data.length}
    />
  ) : (
    <Text>{t('vrackServicesEmptyDataGridMessage')}</Text>
  );
};

export default VrackServicesDatagrid;
