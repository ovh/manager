import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';

import { IntervalUnitType } from '../../../enumTypes';
import {
  getPrice,
  convertIntervalPrice,
  getPriceTextFormatted,
  PriceProps,
} from './price.utils';
import './translations/translations';

const TextPriceContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <span className="ml-1">{children}</span>;

export function Price({
  value,
  intervalUnit,
  tax,
  ovhSubsidiary,
  locale,
  isConvertIntervalUnit,
}: Readonly<PriceProps>) {
  const { t } = useTranslation('price');
  const isAsiaFormat = ['ASIA', 'AU', 'IN', 'SG'].includes(ovhSubsidiary);
  const isGermanFormat = ['DE', 'FI', 'SN'].includes(ovhSubsidiary);
  const isFrenchFormat = [
    'CZ',
    'ES',
    'FR',
    'GB',
    'IE',
    'IT',
    'LT',
    'MA',
    'NL',
    'PL',
    'PT',
    'TN',
  ].includes(ovhSubsidiary);
  const isUSFormat = ['CA', 'QC', 'US', 'WE', 'WS'].includes(ovhSubsidiary);

  const convertedValue = isConvertIntervalUnit
    ? convertIntervalPrice(value, intervalUnit)
    : value;
  const convertedTax = isConvertIntervalUnit
    ? convertIntervalPrice(tax || 0, intervalUnit)
    : tax || 0;

  const priceWithoutTax = getPriceTextFormatted(
    ovhSubsidiary,
    locale,
    getPrice(convertedValue),
  );
  const priceWithTax = getPriceTextFormatted(
    ovhSubsidiary,
    locale,
    getPrice(convertedValue, convertedTax),
  );
  const intervalUnitText =
    intervalUnit && intervalUnit !== IntervalUnitType.none
      ? t(`price_per_${intervalUnit}`)
      : '';
  const components = [
    {
      condition: value === 0,
      component: <span>{t('price_free')}</span>,
    },
    {
      condition: isFrenchFormat && tax > 0,
      component: (
        <>
          <span className="mr-1 text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {priceWithoutTax}
          </span>
          <span className="text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {t('price_ht_label')}
          </span>
          <span className="ml-1 text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {intervalUnitText}
          </span>
          <TextPriceContent>
            <span className="text-[--ods-color-neutral-500] text-[14px] leading-[18px] font-semibold">
              ({priceWithTax}
            </span>
            <span className="ml-1 text-[--ods-color-neutral-500] text-[14px] leading-[18px] font-semibold">
              {t('price_ttc_label')})
            </span>
          </TextPriceContent>
        </>
      ),
    },
    {
      condition: isFrenchFormat && !tax,
      component: (
        <>
          <span className="mr-1 text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {priceWithoutTax}
          </span>
          <span className="text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {t('price_ht_label')}
          </span>
          <span className="ml-1 text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {intervalUnitText}
          </span>
        </>
      ),
    },
    {
      condition: isGermanFormat && tax > 0,
      component: (
        <>
          <span className="mr-1 text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {priceWithTax}
          </span>
          <span className="ml-1 text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {intervalUnitText}
          </span>
        </>
      ),
    },
    {
      condition: isAsiaFormat && (!tax || tax === 0),
      component: (
        <>
          <span className="mr-1 text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {priceWithoutTax}
          </span>
          <span className="text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {t('price_gst_excl_label')}
          </span>
          <span className="ml-1 text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {intervalUnitText}
          </span>
        </>
      ),
    },
    {
      condition: isAsiaFormat,
      component: (
        <>
          <span className="mr-1 text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {priceWithoutTax}
          </span>
          <span className="text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {t('price_gst_excl_label')}
          </span>
          <span className="ml-1 text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {intervalUnitText}
          </span>
          <TextPriceContent>
            <span className="text-[--ods-color-neutral-500] text-[14px] leading-[18px] font-semibold">
              ({priceWithTax}
            </span>
            <span className="ml-1 text-[--ods-color-neutral-500] text-[14px] leading-[18px] font-semibold">
              {t('price_gst_incl_label')})
            </span>
          </TextPriceContent>
        </>
      ),
    },
    {
      condition: isUSFormat,
      component: (
        <>
          <span className="mr-1 text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {priceWithoutTax}
          </span>
          <span className="ml-1 text-[--ods-color-text] text-[16px] leading-[20px] font-semibold">
            {intervalUnitText}
          </span>
        </>
      ),
    },
  ];

  const matchingComponent = components.find(({ condition }) => condition);
  if (!matchingComponent) {
    return <></>;
  }

  return <OdsText>{matchingComponent.component}</OdsText>;
}

export default Price;
