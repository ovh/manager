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
      <Text data-testid="relative-date" preset={TEXT_PRESET.span}>
        {relativeDate}
      </Text>
      <div className="flex">
        <Text className="mr-4" data-testid="officeBusiness" preset={TEXT_PRESET.span}>
          {t('officeBusiness_serie_name')}
        </Text>
        <Text preset={TEXT_PRESET.span}>{officeBusiness}</Text>
      </div>
      <div className="flex">
        <Text className="mr-4" data-testid="officeProPlus" preset={TEXT_PRESET.span}>
          {t('officeProPlus_serie_name')}
        </Text>
        <Text preset={TEXT_PRESET.span}>{officeProPlus}</Text>
      </div>
    </div>
  );
};

export default CustomTooltip;
