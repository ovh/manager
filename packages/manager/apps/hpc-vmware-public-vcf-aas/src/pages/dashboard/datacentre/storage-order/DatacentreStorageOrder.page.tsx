import React from 'react';

import { useTranslation } from 'react-i18next';

import { VCDOrderableStoragePriced } from '@ovh-ux/manager-module-vcd-api';
import { DatagridColumn } from '@ovh-ux/manager-react-components';

import {
  StorageOrderPriceCell,
  StorageOrderSelectCell,
  StorageOrderTypeCell,
  StoragePerformanceClassCell,
} from '@/components/datagrid/storage/StorageOrderCells.component';
import { DatacentreOrder } from '@/components/form/DatacentreOrder.component';
import { DatacentreOrderProvider } from '@/context/DatacentreOrder.context';
import { subRoutes } from '@/routes/routes.constant';

import {
  PERFORMANCE_CLASS_LABEL,
  STORAGE_ORDER_MAX_QUANTITY,
  STORAGE_ORDER_MIN_QUANTITY,
} from './datacentreStorageOrder.constants';

export default function StorageOrderPage() {
  const { t } = useTranslation('datacentres/order');

  const columns: DatagridColumn<VCDOrderableStoragePriced>[] = [
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
      id: 'performanceClass',
      cell: StoragePerformanceClassCell,
      label: PERFORMANCE_CLASS_LABEL,
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
        orderType="storage"
        columns={columns}
        title={t('managed_vcd_vdc_order_storage_title')}
        subtitles={[
          t('managed_vcd_vdc_order_storage_subtitle'),
          t('managed_vcd_vdc_order_storage_subtitle2'),
        ]}
        backLink={`../${subRoutes.datacentreStorage}`}
        minQuantity={STORAGE_ORDER_MIN_QUANTITY}
        maxQuantity={STORAGE_ORDER_MAX_QUANTITY}
      />
    </DatacentreOrderProvider>
  );
}
