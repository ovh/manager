import React from 'react';
import {
  OdsIcon,
  OdsProgressBar,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { VeeamBackupOffer } from '@ovh-ux/manager-module-vcd-api';

export const OfferProgress: React.FC<VeeamBackupOffer> = ({
  name,
  quotaInTB,
  usedSpaceInGB,
}) => {
  const { t } = useTranslation('dashboard');
  const percent = (usedSpaceInGB / (quotaInTB * 10)).toFixed(2);
  const tooltipName = `${name}_tooltip`;
  const tooltipTrigger = `${tooltipName}_trigger`;

  return (
    <div className="flex flex-col">
      <div className="flex mb-3">
        <OdsText>
          {t('space_summary', { usedSpaceInGB, quotaInTB, percent })}
          <OdsIcon
            id={tooltipTrigger}
            className="ml-4"
            name="circle-question"
          />
          <OdsTooltip triggerId={tooltipTrigger}>
            <OdsText>{t(tooltipName)}</OdsText>
          </OdsTooltip>
        </OdsText>
      </div>
      <OdsProgressBar
        className="progress__full-width"
        max={quotaInTB * 1000}
        value={usedSpaceInGB}
      />
    </div>
  );
};
