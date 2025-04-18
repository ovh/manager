import { useTranslation } from 'react-i18next';
import { OdsBadge, OdsIcon, OdsTooltip } from '@ovhcloud/ods-components/react';

export default function CancellationTileItem() {
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex items-center gap-x-3">
      <OdsBadge label={t('managed_vcd_dashboard_coming_soon')} />

      <OdsIcon
        id="cancellation-tooltip-trigger"
        className="color-disabled cursor-pointer"
        name="circle-question"
      />
      <OdsTooltip triggerId="cancellation-tooltip-trigger">
        {t('managed_vcd_dashboard_cancellation_tooltip')}
      </OdsTooltip>
    </div>
  );
}
