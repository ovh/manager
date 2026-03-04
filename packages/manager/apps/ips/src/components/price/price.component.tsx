import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { IntervalUnit } from '@ovh-ux/muk';

import { TRANSLATION_NAMESPACES } from '@/utils';

import { TextPriceContent } from './TextPriceContent.component';
import {
  PriceProps,
  convertIntervalPrice,
  getPrice,
  getPriceTextFormatted,
} from './price.utils';

export function Price({
  value,
  intervalUnit,
  tax,
  ovhSubsidiary,
  locale,
  isConvertIntervalUnit,
  isStartingPrice,
  suffix = '',
  freePriceLabel,
}: Readonly<PriceProps>) {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.price);
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

  const convertedValue =
    isConvertIntervalUnit && intervalUnit
      ? convertIntervalPrice(value, intervalUnit)
      : value;
  const convertedTax =
    isConvertIntervalUnit && intervalUnit
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
    intervalUnit && intervalUnit !== IntervalUnit.none
      ? t(`price_per_${intervalUnit}`)
      : '';
  const components = [
    {
      condition: value === 0,
      component: <span>{freePriceLabel ?? t('price_free')}</span>,
    },
    {
      condition: isFrenchFormat && tax && tax > 0,
      component: (
        <>
          <span className="mr-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {priceWithoutTax}
          </span>
          <span className="text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {t('price_ht_label')}
          </span>
          <span className="ml-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {intervalUnitText}
          </span>
          {suffix && (
            <span className="ml-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
              {suffix}
            </span>
          )}
          <TextPriceContent>
            <span className="text-[14px] font-semibold leading-[18px] text-[--ods-color-neutral-500]">
              ({priceWithTax}
            </span>
            <span className="ml-1 text-[14px] font-semibold leading-[18px] text-[--ods-color-neutral-500]">
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
          <span className="mr-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {priceWithoutTax}
          </span>
          <span className="text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {t('price_ht_label')}
          </span>
          <span className="ml-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {intervalUnitText}
          </span>
          {suffix && (
            <span className="ml-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
              {suffix}
            </span>
          )}
        </>
      ),
    },
    {
      condition: isGermanFormat && tax && tax > 0,
      component: (
        <>
          <span className="mr-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {priceWithTax}
          </span>
          <span className="ml-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {intervalUnitText}
          </span>
          {suffix && (
            <span className="ml-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
              {suffix}
            </span>
          )}
        </>
      ),
    },
    {
      condition: isAsiaFormat && (!tax || tax === 0),
      component: (
        <>
          <span className="mr-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {priceWithoutTax}
          </span>
          <span className="text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {t('price_gst_excl_label')}
          </span>
          <span className="ml-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {intervalUnitText}
          </span>
          {suffix && (
            <span className="ml-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
              {suffix}
            </span>
          )}
        </>
      ),
    },
    {
      condition: isAsiaFormat,
      component: (
        <>
          <span className="mr-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {priceWithoutTax}
          </span>
          <span className="text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {t('price_gst_excl_label')}
          </span>
          <span className="ml-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {intervalUnitText}
          </span>
          {suffix && (
            <span className="ml-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
              {suffix}
            </span>
          )}
          <TextPriceContent>
            <span className="text-[14px] font-semibold leading-[18px] text-[--ods-color-neutral-500]">
              ({priceWithTax}
            </span>
            <span className="ml-1 text-[14px] font-semibold leading-[18px] text-[--ods-color-neutral-500]">
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
          <span className="mr-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {priceWithoutTax}
          </span>
          <span className="ml-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
            {intervalUnitText}
          </span>
          {suffix && (
            <span className="ml-1 text-[16px] font-semibold leading-[20px] text-[--ods-color-text]">
              {suffix}
            </span>
          )}
        </>
      ),
    },
  ];

  const matchingComponent = components.find(({ condition }) => condition);
  if (!matchingComponent) {
    return <></>;
  }

  return (
    <Text>
      {isStartingPrice && value > 0 ? t('price_from_label') : ''}
      {matchingComponent.component}
    </Text>
  );
}

export default Price;
