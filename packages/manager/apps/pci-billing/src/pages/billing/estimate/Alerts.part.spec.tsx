import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import { wrapper } from '@ovh-ux/manager-pci-load-balancer-app/src/wrapperRenders';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { AlertsPart, TAlertsPart } from './Alerts.part';

vi.mock('@ovhcloud/ods-components/react', async () => {
  const {
    OsdsButton: ActualOsdsButton,
    OsdsSpinner: ActualOsdsSpinner,
    OsdsText: ActualOsdsText,
    ...rest
  } = await vi.importActual('@ovhcloud/ods-components/react');
  const [OsdsButtonElem, OsdsSpinnerElem, OsdsTextElem] = [
    ActualOsdsButton as React.ElementType,
    ActualOsdsSpinner as React.ElementType,
    ActualOsdsText as React.ElementType,
  ];
  return {
    ...rest,
    OsdsButton: vi
      .fn()
      .mockImplementation(({ ...props }) => (
        <OsdsButtonElem {...props} data-testid="osds-button" />
      )),
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

vi.mock('recharts');

const defaultProps: TAlertsPart = {
  projectId: '123',
  currency: {
    symbol: '€',
    code: 'EUR',
    format: '€0,0.00',
  },
  currentTotalHourlyPrice: 75,
  forecastTotalHourlyPrice: 78,
  currentPricesError: null,
  alert: {
    creationDate: '',
    delay: 8,
    id: 'id',
    monthlyThreshold: 41,
    email: 'ovh@ovh.com',
    formattedMonthlyThreshold: {
      currencyCode: 'eur',
      text: 'alert text',
      value: 6000,
    },
  },
  onCreate: vi.fn(),
  onUpdate: vi.fn(),
  onDelete: vi.fn(),
  isLoading: false,
};

const renderComponent = (props: TAlertsPart = defaultProps) =>
  render(<AlertsPart {...props} />, { wrapper });
describe('AlertsPart', () => {
  it('should', () => {
    expect(1).toBe(1);
  });

  it('should show spinner if isLoading', () => {
    const { getByTestId } = renderComponent({
      ...defaultProps,
      isLoading: true,
    });
    expect(getByTestId('osds-spinner')).toBeInTheDocument();
  });

  describe('Alert is available', () => {
    it('should render', () => {
      const { container } = renderComponent();
      expect(container).toMatchSnapshot();
    });

    it('should open model if edit button is clicked', () => {
      const { getByText, getByTestId } = renderComponent();
      act(() => getByText('cpbe_estimate_alert_edit').click());
      expect(getByTestId('pciModal-modal')).toBeInTheDocument();
    });

    it('should remove alert if remove button is clicked', () => {
      const { getByText } = renderComponent();
      act(() => getByText('cpbe_estimate_alert_delete').click());
      expect(defaultProps.onDelete).toBeCalledWith('id');
    });
  });
  describe('Alert is not available', () => {
    beforeAll(() => {
      defaultProps.alert = null;
    });
    it('should render', () => {
      const { container } = renderComponent();
      expect(container).toMatchSnapshot();
    });

    it('should open model if create button is clicked', () => {
      const { getByText, getByTestId } = renderComponent();
      act(() => getByText('cpbe_estimate_alert_create').click());
      expect(getByTestId('pciModal-modal')).toBeInTheDocument();
    });
  });
});
