import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import BillingStep, { TBillingStepProps } from './BillingStep.component';

const defaultProps: TBillingStepProps = {
  antiAffinity: {
    isEnabled: false,
    isChecked: false,
    onChange: vi.fn(),
  },
  price: 0,
  monthlyPrice: 0,
  monthlyBilling: {
    isComingSoon: false,
    isChecked: false,
    check: vi.fn(),
  },
  warn: false,
};

vi.mock('@ovhcloud/manager-components', () => ({
  useCatalogPrice: () => ({
    getTextPrice: (price: number) => price,
    getFormattedCatalogPrice: (price: number) => price,
    getFormattedHourlyCatalogPrice: (price: number) => price,
    getFormattedMonthlyCatalogPrice: (price: number) => price,
  }),
}));

describe('BillingStep', () => {
  describe('Anti affinity checkbox', () => {
    it('the checkbox should be disabled from props', () => {
      const props = {
        ...defaultProps,
        antiAffinity: {
          ...defaultProps.antiAffinity,
          isEnabled: false,
        },
      };
      const { getByTestId } = render(<BillingStep {...props} />);

      const checkbox = getByTestId('checkbox');

      expect(checkbox.attributes.getNamedItem('disabled').value).toBe('true');
    });
    it('the checkbox should be enabled from props', () => {
      const props = {
        ...defaultProps,
        antiAffinity: {
          ...defaultProps.antiAffinity,
          isEnabled: true,
        },
      };
      const { getByTestId } = render(<BillingStep {...props} />);

      const checkbox = getByTestId('checkbox');

      expect(checkbox.attributes.getNamedItem('disabled').value).toBe('false');
    });
    it('the checkbox should be checked from props', () => {
      const props = {
        ...defaultProps,
        antiAffinity: {
          ...defaultProps.antiAffinity,
          isChecked: true,
        },
      };
      const { getByTestId } = render(<BillingStep {...props} />);

      const checkbox = getByTestId('checkbox');

      expect(checkbox.attributes.getNamedItem('checked').value).toBe('true');
    });
    it('the checkbox should be unchecked from props', () => {
      const props = {
        ...defaultProps,
        antiAffinity: {
          ...defaultProps.antiAffinity,
          isChecked: false,
        },
      };
      const { getByTestId } = render(<BillingStep {...props} />);

      const checkbox = getByTestId('checkbox');

      expect(checkbox.attributes.getNamedItem('checked').value).toBe('false');
    });
  });

  describe('Hourly billing', () => {
    it('should render hourly billing tile with price from props', () => {
      const props = {
        ...defaultProps,
        price: 5248,
      };
      const { getByTestId } = render(<BillingStep {...props} />);

      const hourlyTile = getByTestId('hourly_tile');

      expect(hourlyTile.innerHTML).toContain('5248');
    });
  });
  describe('Monthly billing', () => {
    describe('tile', () => {
      it('should not show monthly billing tile if if monthly price is not defined', () => {
        const props = {
          ...defaultProps,
          monthlyPrice: undefined,
        };
        const { queryByTestId } = render(<BillingStep {...props} />);

        const monthlyTile = queryByTestId('monthly_tile');

        expect(monthlyTile).not.toBeInTheDocument();
      });

      it('should not show monthly billing tile if if monthly price is defined', () => {
        const props = {
          ...defaultProps,
          monthlyPrice: 15,
        };
        const { queryByTestId } = render(<BillingStep {...props} />);

        const monthlyTile = queryByTestId('monthly_tile');

        expect(monthlyTile.innerHTML).toContain('15');
      });
    });

    describe('Coming soon', () => {
      it('should show is coming soon message if monthly billing coming soon', () => {
        const props = {
          ...defaultProps,
          monthlyBilling: {
            ...defaultProps.monthlyBilling,
            isComingSoon: true,
          },
        };
        const { queryByTestId } = render(<BillingStep {...props} />);

        const yesMessage = queryByTestId('coming_soon_message');
        const noMessage = queryByTestId('billing_description');

        expect(yesMessage).toBeInTheDocument();
        expect(noMessage).not.toBeInTheDocument();
      });

      it('should not show is coming soon message if monthly billing is not coming soon', () => {
        const props = {
          ...defaultProps,
          monthlyBilling: {
            ...defaultProps.monthlyBilling,
            isComingSoon: false,
          },
        };
        const { queryByTestId } = render(<BillingStep {...props} />);

        const yesMessage = queryByTestId('coming_soon_message');
        const noMessage = queryByTestId('billing_description');

        expect(yesMessage).not.toBeInTheDocument();
        expect(noMessage).toBeInTheDocument();
      });
    });
  });
  describe('Warn message', () => {
    it("should show warn message if it's enabled", () => {
      const props = {
        ...defaultProps,
        warn: true,
      };
      const { queryByTestId } = render(<BillingStep {...props} />);

      const warnMessage = queryByTestId('warn_message');

      expect(warnMessage).toBeInTheDocument();
    });

    it("should not show warn message if it's enabled", () => {
      const props = {
        ...defaultProps,
        warn: false,
      };
      const { queryByTestId } = render(<BillingStep {...props} />);

      const warnMessage = queryByTestId('warn_message');

      expect(warnMessage).not.toBeInTheDocument();
    });
  });
});
