import React from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsTooltip,
  OsdsTooltipContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
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
    <OsdsTooltip>
      <OsdsButton
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled
      >
        <OsdsIcon
          name={ODS_ICON_NAME.BIN}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.default}
        />
      </OsdsButton>
      <OsdsTooltipContent slot="tooltip-content">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('managed_vcd_vdc_contact_support')}
        </OsdsText>
      </OsdsTooltipContent>
    </OsdsTooltip>
  );
};
