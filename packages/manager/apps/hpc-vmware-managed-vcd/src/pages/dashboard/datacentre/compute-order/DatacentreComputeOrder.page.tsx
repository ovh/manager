import React from 'react';
import { useTranslation } from 'react-i18next';
import { DatagridColumn } from '@ovh-ux/manager-react-components';
import { VCDOrderableVhostPriced } from '@ovh-ux/manager-module-vcd-api';
import { DatacentreOrderProvider } from '@/context/DatacentreOrder.context';
import { DatacentreOrder } from '@/components/form/DatacentreOrder.component';
import {
  ComputeOrderSelectCell,
  ComputeOrderVhostCell,
  ComputeOrderCpuSpeedCell,
  ComputeOrderRamCell,
  ComputeOrderCpuCountCell,
  ComputeOrderPriceCell,
} from '@/components/datagrid/compute/ComputeOrderCells.component';
import {
  COMPUTE_ORDER_MAX_QUANTITY,
  COMPUTE_ORDER_MIN_QUANTITY,
} from './datacentreComputeOrder.constants';
import { subRoutes } from '@/routes/routes.constant';
import { RAM_LABEL, VHOST_LABEL } from '../compute/datacentreCompute.constants';

export default function ComputeOrderPage() {
  const { t } = useTranslation('datacentres/order');
  const { t: tCompute } = useTranslation('datacentres/compute');
  const columns: DatagridColumn<VCDOrderableVhostPriced>[] = [
    {
      id: 'select',
      cell: ComputeOrderSelectCell,
      label: '',
      isSortable: false,
    },
    {
      id: 'vhost',
      cell: ComputeOrderVhostCell,
      label: VHOST_LABEL,
      isSortable: false,
    },
    {
      id: 'cpuSpeed',
      cell: ComputeOrderCpuSpeedCell,
      label: t('managed_vcd_vdc_order_cpu_speed'),
      isSortable: false,
    },
    {
      id: 'ram',
      cell: ComputeOrderRamCell,
      label: RAM_LABEL,
      isSortable: false,
    },
    {
      id: 'cpuCount',
      cell: ComputeOrderCpuCountCell,
      label: t('managed_vcd_vdc_order_vcpu_count'),
      isSortable: false,
    },
    {
      id: 'price',
      cell: ComputeOrderPriceCell,
      label: t('managed_vcd_vdc_order_price'),
    },
  ];

  return (
    <DatacentreOrderProvider>
      <DatacentreOrder
        orderType="compute"
        columns={columns}
        title={tCompute('managed_vcd_vdc_compute_order_cta')}
        subtitles={[
          t('managed_vcd_vdc_order_compute_subtitle'),
          t('managed_vcd_vdc_order_compute_subtitle2'),
        ]}
        backLink={`../${subRoutes.datacentreCompute}`}
        minQuantity={COMPUTE_ORDER_MIN_QUANTITY}
        maxQuantity={COMPUTE_ORDER_MAX_QUANTITY}
      />
    </DatacentreOrderProvider>
  );
}
