import React from 'react';

import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { IntervalUnitType } from '../../enumTypes';
import { PriceProps } from './Price.props';
import {
  checkAsianFormat,
  checkFranceFormat,
  checkGermanFormat,
  checkUSFormat,
  convertIntervalPrice,
  getPrice,
  getPriceTextFormatted,
} from './Price.utils';
import { PriceText, PriceTextPreset } from './price-text';
import './translations';

export function Price({
  value,
  intervalUnit,
  tax = 0,
  ovhSubsidiary,
  locale,
  isConvertIntervalUnit,
  isStartingPrice,
  suffix = '',
  freePriceLabel,
}: Readonly<PriceProps>) {
  const { t } = useTranslation('price');

  const isAsiaFormat = checkAsianFormat(ovhSubsidiary);
  const isGermanFormat = checkGermanFormat(ovhSubsidiary);
  const isFrenchFormat = checkFranceFormat(ovhSubsidiary);
  const isUSFormat = checkUSFormat(ovhSubsidiary);

  const convertedValue =
    isConvertIntervalUnit && intervalUnit ? convertIntervalPrice(value, intervalUnit) : value;

  const convertedTax =
    isConvertIntervalUnit && intervalUnit ? convertIntervalPrice(tax, intervalUnit) : tax;

  const priceWithoutTax = getPriceTextFormatted(ovhSubsidiary, locale, getPrice(convertedValue));

  const priceWithTax = getPriceTextFormatted(
    ovhSubsidiary,
    locale,
    getPrice(convertedValue, convertedTax),
  );

  const intervalUnitText =
    intervalUnit && intervalUnit !== IntervalUnitType.none ? t(`price_per_${intervalUnit}`) : '';

  const components = [
    {
      condition: value === 0,
      component: <span>{freePriceLabel ?? t('price_free')}</span>,
    },
    {
      condition: isFrenchFormat && tax > 0,
      component: (
        <>
          <PriceText
            price={priceWithoutTax}
            label={t('price_ht_label')}
            intervalUnitText={intervalUnitText}
            suffix={suffix}
          />
          <PriceText
            price={priceWithTax}
            label={t('price_ttc_label')}
            preset={PriceTextPreset.WITH_TAX}
          />
        </>
      ),
    },
    {
      condition: isFrenchFormat && !tax,
      component: (
        <PriceText
          price={priceWithoutTax}
          label={t('price_ht_label')}
          intervalUnitText={intervalUnitText}
          suffix={suffix}
        />
      ),
    },
    {
      condition: isGermanFormat && tax > 0,
      component: (
        <PriceText price={priceWithTax} intervalUnitText={intervalUnitText} suffix={suffix} />
      ),
    },
    {
      condition: isAsiaFormat && (!tax || tax === 0),
      component: (
        <PriceText
          price={priceWithoutTax}
          label={t('price_gst_excl_label')}
          intervalUnitText={intervalUnitText}
          suffix={suffix}
        />
      ),
    },
    {
      condition: isAsiaFormat,
      component: (
        <>
          <PriceText
            price={priceWithoutTax}
            label={t('price_gst_excl_label')}
            intervalUnitText={intervalUnitText}
            suffix={suffix}
          />
          <PriceText
            price={priceWithTax}
            label={t('price_gst_incl_label')}
            preset={PriceTextPreset.WITH_TAX}
          />
        </>
      ),
    },
    {
      condition: isUSFormat,
      component: (
        <PriceText price={priceWithoutTax} intervalUnitText={intervalUnitText} suffix={suffix} />
      ),
    },
  ];

  const matchingComponent = components.find(({ condition }) => condition);
  if (!matchingComponent) {
    return null;
  }

  return (
    <Text>
      {isStartingPrice && value > 0 ? t('price_from_label') : ''}
      {matchingComponent.component}
    </Text>
  );
}

export default Price;
