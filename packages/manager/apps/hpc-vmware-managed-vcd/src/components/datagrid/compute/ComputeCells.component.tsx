import React from 'react';
import { OdsButton, OdsTooltip, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  isStatusTerminated,
  VCDCompute,
  VCDStorage,
} from '@ovh-ux/manager-module-vcd-api';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import TEST_IDS from '@/utils/testIds.constants';

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

export const ActionDeleteCell = (resource: VCDCompute | VCDStorage) => {
  const { t } = useTranslation('datacentres');

  return (
    <>
      <OdsButton
        id={`delete-tooltip-trigger-${resource?.id}`}
        size="sm"
        variant="ghost"
        isDisabled
        label=""
        icon="trash"
        aria-label="delete-datacentre-resource"
        data-testid={TEST_IDS.cellDeleteCta}
      />
      {!isStatusTerminated(resource.resourceStatus) && (
        <OdsTooltip
          triggerId={`delete-tooltip-trigger-${resource?.id}`}
          data-testid={TEST_IDS.cellDeleteTooltip}
        >
          <OdsText>{t('managed_vcd_vdc_contact_support')}</OdsText>
        </OdsTooltip>
      )}
    </>
  );
};
