import { useTranslation } from 'react-i18next';
import { OdsButton, OdsTooltip } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';

// Disabled placeholder CTA. The dashboard tile is complete & previewable, but the
// Order and Terminate actions are wired by the order / service-termination feature
// PRs — until then they are inert and flagged "coming soon" (not production-ready).
export default function ComingSoonButton({
  triggerId,
  label,
  color,
}: Readonly<{
  triggerId: string;
  label: string;
  color?: ODS_BUTTON_COLOR;
}>) {
  const { t: tDashboard } = useTranslation('dashboard');
  return (
    <>
      <OdsButton
        id={triggerId}
        variant={ODS_BUTTON_VARIANT.ghost}
        size={ODS_BUTTON_SIZE.sm}
        color={color}
        label={label}
        isDisabled
      />
      <OdsTooltip triggerId={triggerId}>
        {tDashboard('managed_vcd_dashboard_coming_soon')}
      </OdsTooltip>
    </>
  );
}
