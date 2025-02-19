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
    <div className="flex-wrap">
      <div className="flex items-center gap-x-2">
        <OdsLink isDisabled href="/">
          {t('managed_vcd_dashboard_password_renew')}
        </OdsLink>

        <>
          <OdsIcon
            id="password-tooltip-trigger"
            className="cursor-pointer"
            name="question"
          />
          <OdsTooltip triggerId="password-tooltip-trigger">
            {t('managed_vcd_dashboard_password_tooltip')}
          </OdsTooltip>
        </>
      </div>
      <OdsBadge
        label={t('managed_vcd_dashboard_coming_soon')}
        className="ml-3 mt-3"
        size="sm"
      />
    </div>
  );
}
