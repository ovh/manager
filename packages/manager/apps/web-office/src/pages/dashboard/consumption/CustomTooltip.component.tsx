import React from 'react';

import { formatDistanceToNow } from 'date-fns';
import type { Locale } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

interface CustomTooltipProps {
  payload?: {
    payload: {
      rawDate: Date;
      officeBusiness?: number;
      officeProPlus?: number;
    };
  }[];
  locale: Locale;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ payload, locale }) => {
  const { t } = useTranslation(['dashboard/consumption']);

  if (!payload || payload.length === 0) {
    return null;
  }

  const { rawDate, officeBusiness = 0, officeProPlus = 0 } = payload[0].payload;
  const relativeDate = formatDistanceToNow(rawDate, {
    addSuffix: true,
    locale,
  });

  return (
    <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-300">
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        <span data-testid="relative-date">{relativeDate}</span>

        <span className="flex">
          <div className="mr-4" data-testid="officeBusiness">
            {t('officeBusiness_serie_name')}
          </div>
          {officeBusiness}
        </span>

        <span className="flex">
          <div className="mr-4" data-testid="officeProPlus">
            {t('officeProPlus_serie_name')}
          </div>
          {officeProPlus}
        </span>
      </OdsText>
    </div>
  );
};

export default CustomTooltip;
