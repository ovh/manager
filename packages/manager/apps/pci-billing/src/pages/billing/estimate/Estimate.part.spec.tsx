import { describe, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import {
  EstimatePart,
  TEstimateProps,
} from '@/pages/billing/estimate/Estimate.part';
import { wrapper } from '@/wrapperRenders';

vi.mock('@ovhcloud/ods-components/react', async () => {
  const {
    OsdsSpinner: ActualOsdsSpinner,
    OsdsText: ActualOsdsText,
    ...rest
  } = await vi.importActual('@ovhcloud/ods-components/react');
  const [OsdsSpinnerElem, OsdsTextElem] = [
    ActualOsdsSpinner as React.ElementType,
    ActualOsdsText as React.ElementType,
  ];
  return {
    ...rest,
    OsdsSpinner: vi
      .fn()
      .mockImplementation(({ ...props }) => (
        <OsdsSpinnerElem {...props} data-testid="osds-spinner" />
      )),
    OsdsText: vi
      .fn()
      .mockImplementation(({ ...props }) => (
        <OsdsTextElem {...props} data-testid="osds-text" />
      )),
  };
});

vi.mock('react-i18next', async () => {
  const { ...rest } = await vi.importActual('react-i18next');
  return {
    ...rest,
    useTranslation: vi.fn().mockImplementation((namespace: string) => ({
      t: vi.fn().mockImplementation((key: string) => `${namespace} | ${key}`),
    })),
  };
});

const PROPS: TEstimateProps = {
  currency: {
    symbol: '€',
    code: 'EUR',
    format: '€0,0.00',
  },
  totalHourlyPrice: 75,
  totalMonthlyPrice: 690,
  totalPrice: 75 + 690,
  isPending: false,
  locale: 'enGB',
};

const renderComponent = (props: TEstimateProps = PROPS) =>
  render(<EstimatePart {...props} />, { wrapper });

describe('EstimatePart', () => {
  describe('Prices rae not pending', () => {
    it('should render the component if locale is found', () => {
      const { container } = renderComponent();
      expect(container).toMatchSnapshot();
    });

    it('should render the component if locale is not found', () => {
      const { container } = renderComponent({
        ...PROPS,
        locale: 'notFound',
      });
      expect(container).toMatchSnapshot();
    });
  });

  it('should render the component if is pending', () => {
    const { container } = renderComponent({
      ...PROPS,
      isPending: true,
    });
    expect(container).toMatchSnapshot();
  });
});
