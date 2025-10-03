import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@ovhcloud/ods-react';

import { IntervalUnitType } from '../../enumTypes';
import { PriceProps } from './Price.props';
import {
  getPrice,
  convertIntervalPrice,
  getPriceTextFormatted,
  checkAsianFormat,
  checkGermanFormat,
  checkFranceFormat,
  checkUSFormat,
} from './Price.utils';
import './translations';

import { PriceText, PriceTextPreset } from './price-text';

export function Price({
  value,
  intervalUnit,
  tax = 0,
  ovhSubsidiary,
  locale,
  isConvertIntervalUnit,
}: Readonly<PriceProps>) {
  const { t } = useTranslation('price');

  const isAsiaFormat = checkAsianFormat(ovhSubsidiary);
  const isGermanFormat = checkGermanFormat(ovhSubsidiary);
  const isFrenchFormat = checkFranceFormat(ovhSubsidiary);
  const isUSFormat = checkUSFormat(ovhSubsidiary);

  const convertedValue =
    isConvertIntervalUnit && intervalUnit
      ? convertIntervalPrice(value, intervalUnit)
      : value;

  const convertedTax =
    isConvertIntervalUnit && intervalUnit
      ? convertIntervalPrice(tax, intervalUnit)
      : tax;

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
          <PriceText
            price={priceWithoutTax}
            label={t('price_ht_label')}
            intervalUnitText={intervalUnitText}
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
        />
      ),
    },
    {
      condition: isGermanFormat && tax > 0,
      component: (
        <PriceText price={priceWithTax} intervalUnitText={intervalUnitText} />
      ),
    },
    {
      condition: isAsiaFormat && (!tax || tax === 0),
      component: (
        <PriceText
          price={priceWithoutTax}
          label={t('price_gst_excl_label')}
          intervalUnitText={intervalUnitText}
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
        <PriceText
          price={priceWithoutTax}
          intervalUnitText={intervalUnitText}
        />
      ),
    },
  ];

  const matchingComponent = components.find(({ condition }) => condition);
  if (!matchingComponent) {
    return null;
  }

  return <Text>{matchingComponent.component}</Text>;
}

export default Price;
