import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataGridTextCell,
  Description,
} from '@ovh-ux/manager-react-components';
import { IVdcOrderableVHost } from '@/types/vcd-vdc-orderable-resource.interface';

export const ComputeOrderVhostCell = (vHost: IVdcOrderableVHost) => (
  <DataGridTextCell>{vHost?.profile}</DataGridTextCell>
);

export const ComputeOrderCpuSpeedCell = (vHost: IVdcOrderableVHost) => (
  <DataGridTextCell>{vHost?.vCPUSpeed}</DataGridTextCell>
);

export const ComputeOrderRamCell = (vHost: IVdcOrderableVHost) => (
  <DataGridTextCell>{vHost?.memoryQuota}</DataGridTextCell>
);

export const ComputeOrderCpuCountCell = (vHost: IVdcOrderableVHost) => (
  <DataGridTextCell>{vHost?.vCPUCount}</DataGridTextCell>
);

export const ComputeOrderPriceCell = () => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');

  // TODO: get formatted price
  return (
    <DataGridTextCell>
      <Description className="font-semibold">{'42'}</Description>
      <Description>
        {t('managed_vcd_vdc_compute_order_price_detail')}
      </Description>
    </DataGridTextCell>
  );
};
