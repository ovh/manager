import React from 'react';
import { useTranslation } from 'react-i18next';
import { DatagridColumn } from '@ovh-ux/manager-react-components';
import { DatacentreOrderProvider } from '@/context/DatacentreOrder.context';
import { IVdcOrderableVhostPriced } from '@/types/vcd-vdc-orderable-resource.interface';
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
} from './DatacentreComputeOrder.constants';
import { subRoutes } from '@/routes/routes.constant';

export default function ComputeOrderPage() {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/order');
  const { t: tCompute } = useTranslation(
    'hpc-vmware-managed-vcd/datacentres/compute',
  );
  const columns: DatagridColumn<IVdcOrderableVhostPriced>[] = [
    {
      id: 'select',
      cell: ComputeOrderSelectCell,
      label: '',
      isSortable: false,
    },
    {
      id: 'vhost',
      cell: ComputeOrderVhostCell,
      label: t('managed_vcd_vdc_order_vhost'),
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
      label: t('managed_vcd_vdc_order_ram'),
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
        orderType={'compute'}
        columns={columns}
        title={tCompute('managed_vcd_vdc_compute_order_cta')}
        subtitle={t('managed_vcd_vdc_order_compute_subtitle')}
        backLink={`../${subRoutes.datacentreCompute}`}
        minQuantity={COMPUTE_ORDER_MIN_QUANTITY}
        maxQuantity={COMPUTE_ORDER_MAX_QUANTITY}
      />
    </DatacentreOrderProvider>
  );
}
