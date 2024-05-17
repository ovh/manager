import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { ovhLocaleToI18next } from '@ovh-ux/manager-react-shell-client';
import {
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
  useDataGrid,
} from '@ovhcloud/manager-components';
import { DisplayName } from '@/components/display-name.component';
import { VrackId } from '@/components/vrack-id.component';
import { useVrackServicesList, VrackServicesWithIAM } from '@/api';
import { ProductStatusChip } from '@/components/product-status.components';
import { ActionCell } from './ActionCell';

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
      id: 'currentState.productStatus',
      label: t('productStatus'),
      cell: (vs) => (
        <ProductStatusChip productStatus={vs.currentState.productStatus} />
      ),
    },
    {
      id: 'currentState.region',
      label: t('region'),
      cell: (vs) => (
        <DataGridTextCell>{t(vs.currentState.region)}</DataGridTextCell>
      ),
    },
    {
      id: 'currentState.vrackId',
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
        items={data?.data}
        totalItems={data?.data.length}
        noResultLabel={t('vrackServicesEmptyDataGridMessage')}
      />
      <Outlet />
    </>
  );
};

export default VrackServicesDatagrid;
