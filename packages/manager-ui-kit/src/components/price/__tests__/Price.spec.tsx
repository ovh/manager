import React from 'react';

import { render, screen } from '@testing-library/react';
import { vitest } from 'vitest';

import { DateIntervalOptions, OvhSubsidiary } from '@/commons';
import { Price } from '@/components';

vitest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock sub-components
vitest.mock('../price-text', () => {
  const PriceText = ({ price = '', label = '', intervalUnitText = '' }) => (
    <span>{`${price} ${label} ${intervalUnitText} `}</span>
  );
  return {
    PriceTextPreset: {
      WITH_TAX: 'with-tax',
    },
    PriceText,
  };
});

describe('Price component', () => {
  const renderPriceComponent = (props: React.ComponentProps<typeof Price>) => {
    render(<Price {...props} />);
  };

  const baseProps = {
    value: 3948000000,
    ovhSubsidiary: OvhSubsidiary.FR,
    intervalUnit: DateIntervalOptions.month,
  };
  const priceDefault = '39,48 €';
  const priceHtMonth = '39,48 € price_ht_label price_per_month';
  const priceTTC = '47,38 €';
  const taxNumber = 789600000;
  const localeFr = 'fr-FR';
  it('renders "Inclus" when value is 0', () => {
    const props = {
      ...baseProps,
      value: 0,
      intervalUnit: DateIntervalOptions.none,
      locale: localeFr,
    };
    renderPriceComponent(props);
    const priceElement = screen.getByText('price_free');
    expect(priceElement.parentElement).toHaveTextContent('price_free');
  });

  it('renders a price with locale of the form xx_XX correctly', () => {
    const props = { ...baseProps, locale: 'fr_FR' };
    renderPriceComponent(props);
    const priceElement = screen.getByText(priceDefault, { exact: false });
    expect(priceElement).toHaveTextContent(priceHtMonth);
  });

  it('renders a price for HT correctly', () => {
    const props = { ...baseProps, locale: localeFr };
    renderPriceComponent(props);
    const priceElement = screen.getByText(priceDefault, { exact: false });
    expect(priceElement).toHaveTextContent(priceHtMonth);
  });

  it('if I have a bad local I want it in French', () => {
    const props = { ...baseProps, locale: 'toto' };
    renderPriceComponent(props);
    const priceElement = screen.getByText(priceDefault, { exact: false });
    expect(priceElement).toHaveTextContent(priceHtMonth);
  });

  it('renders a price FR for TTC correctly', () => {
    const props = { ...baseProps, locale: localeFr, tax: taxNumber };
    renderPriceComponent(props);
    const priceElement = screen.getByText(priceDefault, { exact: false });
    expect(priceElement.parentElement).toHaveTextContent(
      `${priceDefault} price_ht_label price_per_month ${priceTTC} price_ttc_label`,
    );
  });

  it('renders a price US correctly', () => {
    const props = {
      ...baseProps,
      locale: 'en-US',
      ovhSubsidiary: OvhSubsidiary.US,
    };
    renderPriceComponent(props);
    const priceElementTTC = screen.getByText('$39.48', { exact: false });
    expect(priceElementTTC).toHaveTextContent('$39.48');
  });

  it('renders a price ASIA correctly with convert unit month', () => {
    const props = {
      ...baseProps,
      locale: 'en-US',
      ovhSubsidiary: OvhSubsidiary.ASIA,
      isConvertIntervalUnit: true,
      tax: taxNumber,
    };
    renderPriceComponent(props);
    const priceElementTTC = screen.getByText('$3.29', { exact: false });
    expect(priceElementTTC.parentElement).toHaveTextContent(
      '$3.29 price_gst_excl_label price_per_month $3.95 price_gst_incl_label',
    );
  });
  it('renders a price ASIA correctly with convert unit month excl gst', () => {
    const props = {
      ...baseProps,
      locale: 'en-US',
      ovhSubsidiary: OvhSubsidiary.ASIA,
      isConvertIntervalUnit: true,
    };
    renderPriceComponent(props);
    const priceElementTTC = screen.getByText('$3.29', { exact: false });
    expect(priceElementTTC).toHaveTextContent('$3.29 price_gst_excl_label price_per_month');
  });

  it('renders a price Deutch correctly', () => {
    const props = {
      ...baseProps,
      locale: 'de-DE',
      ovhSubsidiary: OvhSubsidiary.DE,
      tax: taxNumber,
    };
    renderPriceComponent(props);
    const priceElementTTC = screen.getByText(priceTTC, { exact: false });
    expect(priceElementTTC).toHaveTextContent(priceTTC);
  });
});
