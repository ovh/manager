import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { OdsRadio, OdsText } from '@ovhcloud/ods-components/react';
import { VCDOrderableVhostPriced } from '@ovh-ux/manager-module-vcd-api';
import { getVdcResourcePriceLabel } from '@/utils/getPricedOrderableResource';
import { useDatacentreOrderContext } from '@/context/DatacentreOrder.context';

export const ComputeOrderSelectCell = (vHost: VCDOrderableVhostPriced) => {
  const { selectedResource, setSelectedResource } = useDatacentreOrderContext();
  return (
    <DataGridTextCell>
      <OdsRadio
        name="radio-order-compute"
        value={vHost.profile}
        isChecked={vHost.profile === selectedResource}
        onOdsChange={() => setSelectedResource(vHost.profile)}
      />
    </DataGridTextCell>
  );
};

export const ComputeOrderVhostCell = (vHost: VCDOrderableVhostPriced) => (
  <DataGridTextCell>{vHost.name}</DataGridTextCell>
);

export const ComputeOrderCpuSpeedCell = (vHost: VCDOrderableVhostPriced) => {
  const { t } = useTranslation('datacentres');
  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_vcpu_value', { speed: vHost.vCPUSpeed })}
    </DataGridTextCell>
  );
};

export const ComputeOrderRamCell = (vHost: VCDOrderableVhostPriced) => {
  const { t } = useTranslation('datacentres/order');
  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_order_ram_value', {
        ram: vHost.memoryQuota,
      })}
    </DataGridTextCell>
  );
};

export const ComputeOrderCpuCountCell = (vHost: VCDOrderableVhostPriced) => (
  <DataGridTextCell>{vHost.vCPUCount}</DataGridTextCell>
);

export const ComputeOrderPriceCell = (vHost: VCDOrderableVhostPriced) => {
  const { t } = useTranslation('datacentres/order');
  return (
    <DataGridTextCell>
      <OdsText className="semibold block">
        {getVdcResourcePriceLabel(vHost)}
      </OdsText>
      <OdsText>{t('managed_vcd_vdc_order_price_detail')}</OdsText>
    </DataGridTextCell>
  );
};
