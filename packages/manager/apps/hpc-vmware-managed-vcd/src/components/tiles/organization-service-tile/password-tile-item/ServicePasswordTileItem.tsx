import { useTranslation } from 'react-i18next';
import { OdsBadge, OdsIcon, OdsTooltip } from '@ovhcloud/ods-components/react';
import { Links } from '@ovh-ux/manager-react-components';

export default function ServicePasswordTileItem() {
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-x-3">
        <Links
          isDisabled
          href="/"
          label={t('managed_vcd_dashboard_password_renew')}
          className="[&::part(label)]:whitespace-break-spaces"
        />
        <OdsIcon
          id="password-tooltip-trigger"
          className="color-disabled cursor-pointer"
          name="circle-question"
        />
        <OdsTooltip triggerId="password-tooltip-trigger">
          {t('managed_vcd_dashboard_password_tooltip')}
        </OdsTooltip>
      </div>
      <OdsBadge
        label={t('managed_vcd_dashboard_coming_soon')}
        className="mt-3"
      />
    </div>
  );
}
