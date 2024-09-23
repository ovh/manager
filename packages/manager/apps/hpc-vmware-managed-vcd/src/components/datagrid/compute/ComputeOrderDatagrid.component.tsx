import React from 'react';
import { DatagridColumn, Datagrid } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { IVdcOrderableVhostPriced } from '@/types/vcd-vdc-orderable-resource.interface';
import {
  ComputeOrderSelectCell,
  ComputeOrderVhostCell,
  ComputeOrderCpuSpeedCell,
  ComputeOrderRamCell,
  ComputeOrderCpuCountCell,
  ComputeOrderPriceCell,
} from './ComputeOrderCells.component';

export const ComputeOrderDatagrid = ({
  items,
}: {
  items: IVdcOrderableVhostPriced[];
}) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');

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
      label: t('managed_vcd_vdc_compute_order_vhost'),
      isSortable: false,
    },
    {
      id: 'cpuSpeed',
      cell: ComputeOrderCpuSpeedCell,
      label: t('managed_vcd_vdc_compute_order_cpu_speed'),
      isSortable: false,
    },
    {
      id: 'ram',
      cell: ComputeOrderRamCell,
      label: t('managed_vcd_vdc_compute_order_ram'),
      isSortable: false,
    },
    {
      id: 'cpuCount',
      cell: ComputeOrderCpuCountCell,
      label: t('managed_vcd_vdc_compute_order_vcpu_count'),
      isSortable: false,
    },
    {
      id: 'price',
      cell: ComputeOrderPriceCell,
      label: t('managed_vcd_vdc_compute_order_price'),
    },
  ];

  return (
    <Datagrid
      columns={columns}
      items={items}
      totalItems={items.length}
      contentAlignLeft
    />
  );
};
