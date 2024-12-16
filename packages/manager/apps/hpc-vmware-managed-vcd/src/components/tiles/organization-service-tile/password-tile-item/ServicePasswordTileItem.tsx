import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_CHIP_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsChip,
  OsdsIcon,
  OsdsLink,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';

export default function ServicePasswordTileItem() {
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex-wrap">
      <div className="flex items-center gap-x-2">
        <OsdsLink disabled>
          {t('managed_vcd_dashboard_password_renew')}
        </OsdsLink>
        <OsdsTooltip className="flex items-center">
          <OsdsIcon
            className="cursor-pointer"
            name={ODS_ICON_NAME.HELP}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.text}
          />
          <OsdsTooltipContent slot="tooltip-content" className="break-normal">
            {t('managed_vcd_dashboard_password_tooltip')}
          </OsdsTooltipContent>
        </OsdsTooltip>
      </div>
      <OsdsChip
        inline
        color={ODS_THEME_COLOR_INTENT.primary}
        className="ml-3 mt-3"
        size={ODS_CHIP_SIZE.sm}
      >
        {t('managed_vcd_dashboard_coming_soon')}
      </OsdsChip>
    </div>
  );
}
