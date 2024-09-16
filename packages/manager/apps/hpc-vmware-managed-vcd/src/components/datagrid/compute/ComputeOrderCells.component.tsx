import React, { Dispatch, SetStateAction, useContext } from 'react';
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
import { IVdcOrderableVHost } from '@/types/vcd-vdc-orderable-resource.interface';

export const ComputeOrderSelectCell = ({
  vHost,
  selectedVhost,
  setSelectedVhost,
}: {
  vHost: IVdcOrderableVHost;
  selectedVhost: string;
  setSelectedVhost: Dispatch<SetStateAction<string>>;
}) => (
  <DataGridTextCell>
    <OsdsRadio
      checked={vHost?.name === selectedVhost}
      id={vHost?.name}
      value={vHost?.name}
    >
      <OsdsRadioButton
        onClick={() => setSelectedVhost(vHost?.name)}
        size={ODS_RADIO_BUTTON_SIZE.sm}
        color={ODS_THEME_COLOR_INTENT.primary}
      />
    </OsdsRadio>
  </DataGridTextCell>
);

export const ComputeOrderVhostCell = (vHost: IVdcOrderableVHost) => (
  <DataGridTextCell>{vHost?.profile}</DataGridTextCell>
);

export const ComputeOrderCpuSpeedCell = (vHost: IVdcOrderableVHost) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres');
  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_vcpu_value', { speed: vHost?.vCPUSpeed })}
    </DataGridTextCell>
  );
};

export const ComputeOrderRamCell = (vHost: IVdcOrderableVHost) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');
  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_compute_order_ram_value', {
        ram: vHost?.memoryQuota,
      })}
    </DataGridTextCell>
  );
};

export const ComputeOrderCpuCountCell = (vHost: IVdcOrderableVHost) => (
  <DataGridTextCell>{vHost?.vCPUCount}</DataGridTextCell>
);

export const ComputeOrderPriceCell = () => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');
  const { environment } = useContext(ShellContext);
  const userSubsidiary = environment?.user?.ovhSubsidiary as OvhSubsidiary;

  return (
    <DataGridTextCell>
      <Price
        value={4200000000} // TODO: replace by vHost.price once retrieved
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
