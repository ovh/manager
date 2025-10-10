import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

import Price from '../Price.component';
import { OvhSubsidiary, IntervalUnitType } from '../../../enumTypes';

describe('Price Component', () => {
  const defaultProps = {
    value: 1000000000,
    tax: 200000000,
    intervalUnit: IntervalUnitType.month,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR',
    isConvertIntervalUnit: false,
  };

  it('renders free price when value is 0', () => {
    const { container } = render(<Price {...defaultProps} value={0} />);
    expect(container).toMatchSnapshot();
  });

  it('displays both HT and TTC in French format when tax > 0', () => {
    const { container } = render(
      <Price {...defaultProps} ovhSubsidiary={OvhSubsidiary.FR} tax={2} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('displays only HT in French format when no tax', () => {
    const { container } = render(
      <Price {...defaultProps} ovhSubsidiary={OvhSubsidiary.FR} tax={0} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('displays price with tax in German format', () => {
    const { container } = render(
      <Price {...defaultProps} ovhSubsidiary={OvhSubsidiary.DE} tax={2} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('displays only GST-excl in Asia format if no tax', () => {
    const { container } = render(
      <Price {...defaultProps} ovhSubsidiary={OvhSubsidiary.SG} tax={0} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('displays both GST-excl and GST-incl in Asia format if tax exists', () => {
    const { container } = render(
      <Price {...defaultProps} ovhSubsidiary={OvhSubsidiary.SG} tax={2} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('displays price without tax label in US format', () => {
    const { container } = render(
      <Price {...defaultProps} ovhSubsidiary={OvhSubsidiary.US} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('handles different interval units correctly', () => {
    const { container } = render(
      <Price {...defaultProps} intervalUnit={IntervalUnitType.year} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('does not show intervalUnitText if intervalUnit is "none"', () => {
    const { container } = render(
      <Price {...defaultProps} intervalUnit={IntervalUnitType.none} />,
    );
    expect(container).toMatchSnapshot();
  });
});
