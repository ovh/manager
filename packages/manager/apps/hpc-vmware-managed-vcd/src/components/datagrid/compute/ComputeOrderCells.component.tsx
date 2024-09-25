import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataGridTextCell,
  Description,
} from '@ovh-ux/manager-react-components';
import { OsdsRadio, OsdsRadioButton } from '@ovhcloud/ods-components/react';
import { ODS_RADIO_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { IVdcOrderableVhostPriced } from '@/types/vcd-vdc-orderable-resource.interface';
import { getVdcResourcePriceLabel } from '@/utils/getPricedOrderableResource';
import { useDatacentreOrderContext } from '@/context/DatacentreOrder.context';

export const ComputeOrderSelectCell = (vHost: IVdcOrderableVhostPriced) => {
  const { selectedResource, setSelectedResource } = useDatacentreOrderContext();
  return (
    <DataGridTextCell>
      <OsdsRadio
        checked={vHost.profile === selectedResource}
        id={vHost.profile}
        value={vHost.profile}
      >
        <OsdsRadioButton
          onClick={() => setSelectedResource(vHost.profile)}
          size={ODS_RADIO_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </OsdsRadio>
    </DataGridTextCell>
  );
};

export const ComputeOrderVhostCell = (vHost: IVdcOrderableVhostPriced) => (
  <DataGridTextCell>{vHost.profile}</DataGridTextCell>
);

export const ComputeOrderCpuSpeedCell = (vHost: IVdcOrderableVhostPriced) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres');
  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_vcpu_value', { speed: vHost.vCPUSpeed })}
    </DataGridTextCell>
  );
};

export const ComputeOrderRamCell = (vHost: IVdcOrderableVhostPriced) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/order');
  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_order_ram_value', {
        ram: vHost.memoryQuota,
      })}
    </DataGridTextCell>
  );
};

export const ComputeOrderCpuCountCell = (vHost: IVdcOrderableVhostPriced) => (
  <DataGridTextCell>{vHost.vCPUCount}</DataGridTextCell>
);

export const ComputeOrderPriceCell = (vHost: IVdcOrderableVhostPriced) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/order');
  return (
    <DataGridTextCell>
      <Description className="font-semibold">
        {getVdcResourcePriceLabel(vHost)}
      </Description>
      <Description>{t('managed_vcd_vdc_order_price_detail')}</Description>
    </DataGridTextCell>
  );
};
