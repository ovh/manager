import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsBadge,
  OdsIcon,
  OdsLink,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';

export default function ServicePasswordTileItem() {
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-x-2">
        <OdsLink
          isDisabled
          href="/"
          label={t('managed_vcd_dashboard_password_renew')}
        />
        <OdsIcon
          id="password-tooltip-trigger"
          className="cursor-pointer"
          name="circle-question"
        />
        <OdsTooltip triggerId="password-tooltip-trigger">
          {t('managed_vcd_dashboard_password_tooltip')}
        </OdsTooltip>
      </div>
      <OdsBadge
        label={t('managed_vcd_dashboard_coming_soon')}
        className="mt-1"
      />
    </div>
  );
}
