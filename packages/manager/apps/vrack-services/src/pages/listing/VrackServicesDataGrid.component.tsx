import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { ovhLocaleToI18next } from '@ovh-ux/manager-react-shell-client';
import {
  ColumnSort,
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
  useDataGrid,
} from '@ovhcloud/manager-components';
import { DisplayName } from '@/components/display-name/DisplayName.component';
import { VrackId } from '@/components/vrack-id/VrackId.component';
import {
  getDisplayName,
  useVrackServicesList,
  VrackServicesWithIAM,
} from '@/data';
import { ProductStatusChip } from '@/components/ProductStatusChip.component';
import { ActionCell } from './ActionCell.component';

const sortVrackServicesListing = (
  sorting: ColumnSort,
  originalList: VrackServicesWithIAM[] = [],
) => {
  const vsList = [...originalList];
  vsList.sort((vs1, vs2) => {
    switch (sorting.id) {
      case 'displayName':
        return getDisplayName(vs1)?.localeCompare(getDisplayName(vs2));
      case 'createdAt':
        return vs1.createdAt?.localeCompare(vs2.createdAt);
      case 'productStatus':
        return vs1.currentState.productStatus?.localeCompare(
          vs2.currentState.productStatus,
        );
      case 'region':
        return vs1.currentState.region?.localeCompare(vs2.currentState.region);
      case 'vrackId':
        return vs1.currentState.vrackId?.localeCompare(
          vs2.currentState.vrackId,
        );
      default:
        return 0;
    }
  });

  return sorting.desc ? vsList.reverse() : vsList;
};

export const VrackServicesDatagrid: React.FC = () => {
  const { t, i18n } = useTranslation('vrack-services/listing');

  const { data } = useVrackServicesList();
  const { sorting, setSorting } = useDataGrid({
    id: 'displayName',
    desc: false,
  });

  const columns: DatagridColumn<VrackServicesWithIAM>[] = [
    {
      id: 'displayName',
      label: t('displayName'),
      cell: (vs) => <DisplayName {...vs} isListing />,
    },
    {
      id: 'productStatus',
      label: t('productStatus'),
      cell: (vs) => (
        <ProductStatusChip productStatus={vs.currentState.productStatus} />
      ),
    },
    {
      id: 'region',
      label: t('region'),
      cell: (vs) => (
        <DataGridTextCell>{t(vs.currentState.region)}</DataGridTextCell>
      ),
    },
    {
      id: 'vrackId',
      label: t('vrackId'),
      cell: (vs) => <VrackId isListing {...vs} />,
    },
    {
      id: 'createdAt',
      label: t('createdAt'),
      cell: (vs) => {
        const date = new Date(vs.createdAt);
        return (
          <DataGridTextCell>
            {date.toString() !== 'Invalid Date'
              ? date.toLocaleDateString(ovhLocaleToI18next(i18n.language))
              : '-'}
          </DataGridTextCell>
        );
      },
    },
    {
      id: 'actions',
      label: t('actions'),
      isSortable: false,
      cell: (vs) => <ActionCell {...vs} />,
    },
  ];

  return (
    <>
      <Datagrid
        wrapperStyle={{ display: 'flex' }}
        tableStyle={{ minWidth: '1000px' }}
        className="pb-[200px] -mx-6"
        sorting={sorting}
        onSortChange={setSorting}
        columns={columns}
        items={sortVrackServicesListing(sorting, data?.data)}
        totalItems={data?.data.length}
        noResultLabel={t('vrackServicesEmptyDataGridMessage')}
      />
      <Outlet />
    </>
  );
};

export default VrackServicesDatagrid;
