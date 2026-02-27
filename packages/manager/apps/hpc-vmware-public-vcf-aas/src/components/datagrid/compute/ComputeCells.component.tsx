import { OdsButton, OdsTooltip, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { isStatusTerminated, VCDCompute } from '@ovh-ux/manager-module-vcd-api';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import TEST_IDS from '@/utils/testIds.constants';
import { useComputeDeletionAccess } from '@/hooks/datacentre/useComputeDeletionAccess';

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

export const ActionDeleteComputeCell = (vcdCompute: VCDCompute) => {
  const {
    navigateToDeletePage,
    isDeletionAllowed,
    tooltipLabel,
  } = useComputeDeletionAccess(vcdCompute);
  const buttonId = `delete-tooltip-trigger-${vcdCompute.id}`;
  const shouldShowTooltip = !isDeletionAllowed && tooltipLabel;

  return (
    <>
      <OdsButton
        id={buttonId}
        size="sm"
        variant="ghost"
        isDisabled={!isDeletionAllowed}
        onClick={navigateToDeletePage}
        label=""
        icon="trash"
        aria-label="delete-datacentre-compute"
        data-testid={TEST_IDS.cellDeleteCta}
      />
      {!isStatusTerminated(vcdCompute.resourceStatus) && shouldShowTooltip && (
        <OdsTooltip
          triggerId={buttonId}
          data-testid={TEST_IDS.cellDeleteTooltip}
        >
          <OdsText>{tooltipLabel}</OdsText>
        </OdsTooltip>
      )}
    </>
  );
};
