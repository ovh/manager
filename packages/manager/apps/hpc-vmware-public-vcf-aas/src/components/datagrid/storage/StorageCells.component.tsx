import React from 'react';
import { VCDStorage } from '@ovh-ux/manager-module-vcd-api';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { capitalize } from '@/utils/capitalize';

export const DatagridIdCell = (vcdStorage: VCDStorage) => (
  <DataGridTextCell>{vcdStorage?.id}</DataGridTextCell>
);

export const DatagridNameCell = (vcdStorage: VCDStorage) => (
  <DataGridTextCell>{vcdStorage?.currentState?.name}</DataGridTextCell>
);

export const DatagridProfileCell = (vcdStorage: VCDStorage) => (
  <DataGridTextCell>{vcdStorage?.currentState?.profile}</DataGridTextCell>
);

export const DatagridTypeCell = (vcdStorage: VCDStorage) => (
  <DataGridTextCell>
    {capitalize(vcdStorage?.currentState?.type)}
  </DataGridTextCell>
);

export const DatagridCapacityCell = (vcdStorage: VCDStorage) => {
  const { t } = useTranslation('datacentres');
  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_quota_value', {
        quota: vcdStorage?.currentState.capacity,
      })}
    </DataGridTextCell>
  );
};

export const DatagridBillingCell = (vcdStorage: VCDStorage) => {
  const { t } = useTranslation('datacentres/compute');
  return (
    <DataGridTextCell>
      {t(
        `managed_vcd_vdc_compute_billing_${vcdStorage?.currentState?.billingType}`,
      )}
    </DataGridTextCell>
  );
};
