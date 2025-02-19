import React from 'react';
import { OdsButton, OdsTooltip, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { VCDCompute } from '@ovh-ux/manager-module-vcd-api';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';

export const DatagridIdCell = (vcdCompute: VCDCompute) => (
  <DataGridTextCell>{vcdCompute?.id}</DataGridTextCell>
);

export const DatagridVHostProfilCell = (vcdCompute: VCDCompute) => (
  <DataGridTextCell>{vcdCompute?.currentState?.profile}</DataGridTextCell>
);

export const DatagridCpuCountCell = (vcdCompute: VCDCompute) => (
  <DataGridTextCell>{vcdCompute.currentState?.vCPUCount}</DataGridTextCell>
);

export const DatagridBillingCell = (vcdCompute: VCDCompute) => {
  const { t } = useTranslation('datacentres/compute');
  return (
    <DataGridTextCell>
      {t(
        `managed_vcd_vdc_compute_billing_${vcdCompute.currentState?.billingType}`,
      )}
    </DataGridTextCell>
  );
};

export const DatagridRamCountCell = (vcdCompute: VCDCompute) => {
  const { t } = useTranslation('datacentres');

  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_quota_value', {
        quota: vcdCompute.currentState?.memoryQuota,
      })}
    </DataGridTextCell>
  );
};

export const ActionDeleteCell = () => {
  const { t } = useTranslation('datacentres');

  return (
    <>
      <OdsButton
        id="delete-tooltip-trigger"
        size="sm"
        variant="ghost"
        color="primary"
        isDisabled
        label=""
        icon="trash" // TODO: size xs + color default
      />
      <OdsTooltip triggerId="delete-tooltip-trigger">
        <OdsText>{t('managed_vcd_vdc_contact_support')}</OdsText>
      </OdsTooltip>
    </>
  );
};
