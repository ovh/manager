import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataGridTextCell,
  Description,
  OvhSubsidiary,
  Price,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OsdsRadio, OsdsRadioButton } from '@ovhcloud/ods-components/react';
import { ODS_RADIO_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { IVdcOrderableVhostPriced } from '@/types/vcd-vdc-orderable-resource.interface';
import { getVhostUcentsPrice } from '@/utils/getPricedOrderableResource';
import { useComputeOrderContext } from '@/context/ComputeOrder.context';

export const ComputeOrderSelectCell = (vHost: IVdcOrderableVhostPriced) => {
  const { selectedVhost, setSelectedVhost } = useComputeOrderContext();
  return (
    <DataGridTextCell>
      <OsdsRadio
        checked={vHost.profile === selectedVhost}
        id={vHost.profile}
        value={vHost.profile}
      >
        <OsdsRadioButton
          onClick={() => setSelectedVhost(vHost.profile)}
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
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');
  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_compute_order_ram_value', {
        ram: vHost.memoryQuota,
      })}
    </DataGridTextCell>
  );
};

export const ComputeOrderCpuCountCell = (vHost: IVdcOrderableVhostPriced) => (
  <DataGridTextCell>{vHost.vCPUCount}</DataGridTextCell>
);

export const ComputeOrderPriceCell = (vHost: IVdcOrderableVhostPriced) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');
  const { environment } = useContext(ShellContext);
  const userSubsidiary = environment?.user?.ovhSubsidiary as OvhSubsidiary;

  return (
    <DataGridTextCell>
      <Price
        value={getVhostUcentsPrice(vHost)}
        ovhSubsidiary={userSubsidiary}
        locale={''}
        tax={0}
      />
      <Description>
        {t('managed_vcd_vdc_compute_order_price_detail')}
      </Description>
    </DataGridTextCell>
  );
};
