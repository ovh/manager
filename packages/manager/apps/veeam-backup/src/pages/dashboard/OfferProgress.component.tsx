import React from 'react';
import {
  OsdsIcon,
  OsdsProgressBar,
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { VeeamBackupOffer } from '@/data';

export const OfferProgress: React.FC<VeeamBackupOffer> = ({
  name,
  quotaInTB,
  usedSpaceInGB,
}) => {
  const { t } = useTranslation('dashboard');
  const percent = (usedSpaceInGB / (quotaInTB * 10)).toFixed(2);
  const label = `${usedSpaceInGB} Go / ${quotaInTB} To (${percent}%)`;

  return (
    <div className="flex flex-col">
      <div className="flex mb-3">
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._500}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {label}
        </OsdsText>
        <OsdsTooltip>
          <OsdsIcon
            className="ml-4"
            name={ODS_ICON_NAME.HELP_CIRCLE}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_ICON_SIZE.xs}
          />
          <OsdsTooltipContent slot="tooltip-content">
            {t(`${name}_tooltip`)}
          </OsdsTooltipContent>
        </OsdsTooltip>
      </div>
      <OsdsProgressBar max={quotaInTB * 1000} value={usedSpaceInGB} />
    </div>
  );
};
