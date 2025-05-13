import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import BillingStep, { TBillingStepProps } from './BillingStep.component';
import { wrapper } from '@/wrapperRenders';

const defaultProps: TBillingStepProps = {
  price: 0,
  monthlyPrice: 0,
  monthlyBilling: {
    isComingSoon: false,
    isChecked: false,
    check: vi.fn(),
  },
  warn: false,
};

vi.mock('@ovh-ux/manager-react-components', () => ({
  useProjectUrl: vi.fn().mockReturnValue('mockProjectUrl'),
  useCatalogPrice: () => ({
    getTextPrice: (price: number) => price,
    getFormattedCatalogPrice: (price: number) => price,
    getFormattedHourlyCatalogPrice: (price: number) => price,
    getFormattedMonthlyCatalogPrice: (price: number) => price,
  }),
}));

describe('BillingStep', () => {
  describe('Hourly billing', () => {
    it('should render hourly billing tile with price from props', () => {
      const props = {
        ...defaultProps,
        price: 5248,
      };
      const { getByTestId } = render(<BillingStep {...props} />, { wrapper });

      const hourlyTile = getByTestId('hourly_tile');

      expect(hourlyTile.innerHTML).toContain('5248');
    });
  });
  describe('Monthly billing', () => {
    describe('tile', () => {
      it('should not show monthly billing tile when monthlyBilling.isComingSoon is true', () => {
        const props = {
          ...defaultProps,
          monthlyPrice: undefined,
          monthlyBilling: {
            ...defaultProps.monthlyBilling,
            isComingSoon: true,
          },
        };
        const { queryByTestId } = render(<BillingStep {...props} />, {
          wrapper,
        });

        const monthlyTile = queryByTestId('monthly_tile');

        expect(monthlyTile).not.toBeInTheDocument();
      });

      it('should show monthly billing tile when monthlyBilling.isComingSoon is false', () => {
        const props = {
          ...defaultProps,
          monthlyPrice: 15,
          monthlyBilling: {
            ...defaultProps.monthlyBilling,
            isComingSoon: false,
          },
        };
        const { queryByTestId } = render(<BillingStep {...props} />, {
          wrapper,
        });

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
        const { queryByTestId } = render(<BillingStep {...props} />, {
          wrapper,
        });

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
        const { queryByTestId } = render(<BillingStep {...props} />, {
          wrapper,
        });

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
      const { queryByTestId } = render(<BillingStep {...props} />, { wrapper });

      const warnMessage = queryByTestId('warn_message');

      expect(warnMessage).toBeInTheDocument();
    });

    it("should not show warn message if it's enabled", () => {
      const props = {
        ...defaultProps,
        warn: false,
      };
      const { queryByTestId } = render(<BillingStep {...props} />, { wrapper });

      const warnMessage = queryByTestId('warn_message');

      expect(warnMessage).not.toBeInTheDocument();
    });
  });
});
