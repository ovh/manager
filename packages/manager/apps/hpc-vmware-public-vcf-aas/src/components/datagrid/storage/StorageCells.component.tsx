import { OdsButton, OdsTooltip, OdsText } from '@ovhcloud/ods-components/react';
import { isStatusTerminated, VCDStorage } from '@ovh-ux/manager-module-vcd-api';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { capitalize } from '@/utils/capitalize';
import TEST_IDS from '@/utils/testIds.constants';

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

export const ActionDeleteStorageCell = (resource: VCDStorage) => {
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
        aria-label="delete-datacentre-storage"
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
