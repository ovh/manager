import React from 'react';

import { formatDistanceToNow } from 'date-fns';
import type { Locale } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

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
    <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-xl">
      <Text preset={TEXT_PRESET.paragraph}>
        <span data-testid="relative-date">{relativeDate}</span>

        <div className="flex">
          <span className="mr-4" data-testid="officeBusiness">
            {t('officeBusiness_serie_name')}
          </span>
          {officeBusiness}
        </div>

        <div className="flex">
          <span className="mr-4" data-testid="officeProPlus">
            {t('officeProPlus_serie_name')}
          </span>
          {officeProPlus}
        </div>
      </Text>
    </div>
  );
};

export default CustomTooltip;
