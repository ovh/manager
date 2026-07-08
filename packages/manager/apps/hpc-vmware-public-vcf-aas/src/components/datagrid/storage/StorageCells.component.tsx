import { OdsButton, OdsTooltip, OdsText } from '@ovhcloud/ods-components/react';
import { isStatusTerminated, VCDStorage } from '@ovh-ux/manager-module-vcd-api';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { capitalize } from '@/utils/capitalize';
import TEST_IDS from '@/utils/testIds.constants';
import { useVdcResourceDeletionAccess } from '@/hooks/datacentre/useVdcResourceDeletionAccess';

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

export const ActionDeleteStorageCell = (vcdStorage: VCDStorage) => {
  const {
    navigateToDeletePage,
    isDeletionAllowed,
    tooltipLabel,
  } = useVdcResourceDeletionAccess({ type: 'storage', resource: vcdStorage });
  const buttonId = `delete-tooltip-trigger-${vcdStorage.id}`;
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
        aria-label="delete-datacentre-storage"
        data-testid={TEST_IDS.cellDeleteCta}
      />
      {!isStatusTerminated(vcdStorage.resourceStatus) && shouldShowTooltip && (
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
