import { screen } from '@testing-library/react';
import Price from './price.component';
import { render } from '../../../utils/test.provider';
import { IntervalUnitType, OvhSubsidiary } from '../../../enumTypes';

describe('Price component', () => {
  const renderPriceComponent = (props) => {
    render(<Price {...props} />);
  };

  const baseProps = {
    value: 3948000000,
    ovhSubsidiary: OvhSubsidiary.FR,
    intervalUnit: IntervalUnitType.month,
  };
  const priceDefault = '39,48 €';
  const priceHtMonth = '39,48 €HT/mois';
  const priceTTC = '47,38 €';
  const taxNumber = 789600000;
  const localeFr = 'fr-FR';
  it('renders "Inclus" when value is 0', () => {
    const props = {
      ...baseProps,
      value: 0,
      intervalUnit: IntervalUnitType.none,
    };
    renderPriceComponent(props);
    const priceElement = screen.getByText('Inclus');
    expect(priceElement.parentElement).toHaveTextContent('Inclus');
  });

  it('renders a price with locale of the form xx_XX correctly', () => {
    const props = { ...baseProps, locale: 'fr_FR' };
    renderPriceComponent(props);
    const priceElement = screen.getByText(priceDefault);
    expect(priceElement.parentElement).toHaveTextContent(priceHtMonth);
  });

  it('renders a price for HT correctly', () => {
    const props = { ...baseProps, locale: localeFr };
    renderPriceComponent(props);
    const priceElement = screen.getByText(priceDefault);
    expect(priceElement.parentElement).toHaveTextContent(priceHtMonth);
  });

  it('if I have a bad local I want it in French', () => {
    const props = { ...baseProps, locale: 'toto' };
    renderPriceComponent(props);
    const priceElement = screen.getByText(priceDefault);
    expect(priceElement.parentElement).toHaveTextContent(priceHtMonth);
  });

  it('renders a price FR for TTC correctly', () => {
    const props = { ...baseProps, locale: localeFr, tax: taxNumber };
    renderPriceComponent(props);
    const priceElement = screen.getByText(priceDefault);
    expect(priceElement.parentElement).toHaveTextContent(
      `${priceDefault}HT/mois(${priceTTC}TTC)`,
    );
  });

  it('renders a price US correctly', () => {
    const props = {
      ...baseProps,
      locale: 'en-US',
      ovhSubsidiary: OvhSubsidiary.US,
    };
    renderPriceComponent(props);
    const priceElementTTC = screen.getByText('$39.48');
    expect(priceElementTTC.parentElement).toHaveTextContent('$39.48');
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
    const priceElementTTC = screen.getByText('$3.29');
    expect(priceElementTTC.parentElement).toHaveTextContent(
      '$3.29ex. GST/mois($3.95incl. GST)',
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
    const priceElementTTC = screen.getByText('$3.29');
    expect(priceElementTTC.parentElement).toHaveTextContent(
      '$3.29ex. GST/mois',
    );
  });

  it('renders a price Deutch correctly', () => {
    const props = {
      ...baseProps,
      locale: 'de-DE',
      ovhSubsidiary: OvhSubsidiary.DE,
      tax: taxNumber,
    };
    renderPriceComponent(props);
    const priceElementTTC = screen.getByText(priceTTC);
    expect(priceElementTTC.parentElement).toHaveTextContent(priceTTC);
  });
});
