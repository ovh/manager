import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

type DisplayBandwidth = {
  value: string;
  unit: string;
  simpleFormat: string;
  perSecondFormat: string;
};

function formatNumberWithDecimal(input: number, baseNumber: number): string {
  return input % baseNumber
    ? (Math.floor((100 * input) / baseNumber) / 100).toFixed(2)
    : `${input / baseNumber}`;
}

export function useBandwidthFormatConverter(): (mbpsBandwidth: number) => DisplayBandwidth {
  const { t } = useTranslation(NAMESPACES.BYTES);

  return useCallback(
    (mbpsBandwidth: number): DisplayBandwidth => {
      if (mbpsBandwidth >= 1000000) {
        const value = formatNumberWithDecimal(mbpsBandwidth, 1000000);
        return {
          value,
          unit: t('unit_size_TB'),
          simpleFormat: `${value} ${t('unit_size_TB')}`,
          perSecondFormat: `${value}${t('unit_size_TB')}/s`,
        };
      }

      if (mbpsBandwidth >= 1000) {
        const value = formatNumberWithDecimal(mbpsBandwidth, 1000);
        return {
          value,
          unit: t('unit_size_GB'),
          simpleFormat: `${value} ${t('unit_size_GB')}`,
          perSecondFormat: `${value}${t('unit_size_GB')}/s`,
        };
      }

      return {
        value: `${mbpsBandwidth}`,
        unit: t('unit_size_MB'),
        simpleFormat: `${mbpsBandwidth} ${t('unit_size_MB')}`,
        perSecondFormat: `${mbpsBandwidth}${t('unit_size_MB')}/s`,
      };
    },
    [t],
  );
}
