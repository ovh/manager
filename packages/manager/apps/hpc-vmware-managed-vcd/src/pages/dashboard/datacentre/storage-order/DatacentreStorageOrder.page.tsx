import React from 'react';
import { useTranslation } from 'react-i18next';
import { DatagridColumn } from '@ovh-ux/manager-react-components';
import { DatacentreOrderProvider } from '@/context/DatacentreOrder.context';
import { IVdcOrderableStoragePriced } from '@/types/vcd-vdc-orderable-resource.interface';
import { DatacentreOrder } from '@/components/form/DatacentreOrder.component';
import {
  StorageOrderPriceCell,
  StorageOrderSelectCell,
  StorageOrderTypeCell,
} from '@/components/datagrid/storage/StorageOrderCells.component';
import {
  STORAGE_ORDER_MAX_QUANTITY,
  STORAGE_ORDER_MIN_QUANTITY,
} from './DatacentreStorageOrder.constants';
import { subRoutes } from '@/routes/routes.constant';

export default function StorageOrderPage() {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/order');

  const columns: DatagridColumn<IVdcOrderableStoragePriced>[] = [
    {
      id: 'select',
      cell: StorageOrderSelectCell,
      label: '',
      isSortable: false,
    },
    {
      id: 'storage',
      cell: StorageOrderTypeCell,
      label: t('managed_vcd_vdc_order_type'),
      isSortable: false,
    },
    {
      id: 'price',
      cell: StorageOrderPriceCell,
      label: t('managed_vcd_vdc_order_price'),
      isSortable: false,
    },
  ];

  return (
    <DatacentreOrderProvider>
      <DatacentreOrder
        orderType={'storage'}
        columns={columns}
        title={t('managed_vcd_vdc_order_storage_title')}
        subtitle={t('managed_vcd_vdc_order_storage_subtitle')}
        backLink={`../${subRoutes.datacentreStorage}`}
        minQuantity={STORAGE_ORDER_MIN_QUANTITY}
        maxQuantity={STORAGE_ORDER_MAX_QUANTITY}
      />
    </DatacentreOrderProvider>
  );
}
