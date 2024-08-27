import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TEXT_COLOR_HUE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
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
}) => (
  <OsdsText
    size={ODS_TEXT_SIZE._200}
    color={ODS_THEME_COLOR_INTENT.default}
    hue={ODS_TEXT_COLOR_HUE._500}
    className="ml-1"
  >
    {children}
  </OsdsText>
);

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
          <span className="mr-1">{priceWithoutTax}</span>
          {t('price_ht_label')}
          <span className="ml-1">{intervalUnitText}</span>
          <TextPriceContent>
            ({priceWithTax}
            <span className="ml-1">{t('price_ttc_label')})</span>
          </TextPriceContent>
        </>
      ),
    },
    {
      condition: isFrenchFormat && !tax,
      component: (
        <>
          <span className="mr-1">{priceWithoutTax}</span>
          {t('price_ht_label')}
          <span className="ml-1">{intervalUnitText}</span>
        </>
      ),
    },
    {
      condition: isGermanFormat && tax > 0,
      component: (
        <>
          <span className="mr-1">{priceWithTax}</span>
          {intervalUnitText}
        </>
      ),
    },
    {
      condition: isAsiaFormat && (!tax || tax === 0),
      component: (
        <>
          <span className="mr-1">{priceWithoutTax}</span>
          {t('price_gst_excl_label')}
          <span className="ml-1">{intervalUnitText}</span>
        </>
      ),
    },
    {
      condition: isAsiaFormat,
      component: (
        <>
          <span className="mr-1">{priceWithoutTax}</span>
          {t('price_gst_excl_label')}
          <span className="ml-1">{intervalUnitText}</span>
          <TextPriceContent>
            ({priceWithTax}
            <span className="ml-1">{t('price_gst_incl_label')})</span>
          </TextPriceContent>
        </>
      ),
    },
    {
      condition: isUSFormat,
      component: (
        <>
          <span className="mr-1">{priceWithoutTax}</span>
          {intervalUnitText}
        </>
      ),
    },
  ];

  const matchingComponent = components.find(({ condition }) => condition);
  if (!matchingComponent) {
    return <></>;
  }

  return (
    <OsdsText
      color={ODS_THEME_COLOR_INTENT.text}
      level={ODS_TEXT_LEVEL.body}
      size={ODS_TEXT_SIZE._500}
      hue={ODS_TEXT_COLOR_HUE._500}
    >
      {matchingComponent.component}
    </OsdsText>
  );
}

export default Price;
