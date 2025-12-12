import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { wrapper } from '@/wrapperRenders';

import BillingStep, { TBillingStepProps } from './BillingStep.component';

const defaultProps: TBillingStepProps = {
  price: 0,
  monthlyPrice: 0,
  monthlyBilling: {
    isComingSoon: false,
    isChecked: false,
    check: vi.fn(),
  },
  warn: false,
  numberOfNodes: null,
  priceFloatingIp: null,
  selectedAvailabilityZonesNumber: undefined,
};

vi.mock('@ovh-ux/manager-react-components', async () => ({
  ...(await vi.importActual('@ovh-ux/manager-react-components')),
  useProjectUrl: vi.fn().mockReturnValue('mockProjectUrl'),
  useCatalogPrice: () => ({
    getTextPrice: (price: number) => price,
    getFormattedCatalogPrice: (price: number) => price,
    getFormattedHourlyCatalogPrice: (price: number) => price + ' /Hour',
    getFormattedMonthlyCatalogPrice: (price: number) => price + ' /Month',
  }),
}));

vi.mock('@/hooks/useSavingPlanAvailable', () => ({
  default: vi.fn().mockReturnValue(true),
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
      // monthly price
      expect(hourlyTile.innerHTML).toContain('3831040');
    });
    it('should call getFormattedMonthlyCatalogPrice with the correct value', () => {});
  });
  describe('Monthly billing', () => {
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

      expect(monthlyTile?.innerHTML).toContain('15');
    });

    it('should show savings plan banner if monthly billing coming soon and savings plan available', () => {
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
      expect(yesMessage?.innerHTML).toContain('mockProjectUrl/savings-plan');
    });

    it('should not show savings plan banner if monthly billing is not coming soon', () => {
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

    it("should not show warn message if it's disabled", () => {
      const props = {
        ...defaultProps,
        warn: false,
      };
      const { queryByTestId } = render(<BillingStep {...props} />, { wrapper });

      const warnMessage = queryByTestId('warn_message');

      expect(warnMessage).not.toBeInTheDocument();
    });
  });

  describe('Floating IP cost', () => {
    it('should show floating IP cost text in hourly tile when priceFloatingIp is provided', () => {
      const props = {
        ...defaultProps,
        price: 100,
        numberOfNodes: 3,
        priceFloatingIp: { hour: 0.5, month: 365 },
      };
      const { getByTestId } = render(<BillingStep {...props} />, { wrapper });

      const hourlyTile = getByTestId('hourly_tile');

      expect(hourlyTile.innerHTML).toContain(
        'pci_projects_project_instances_configure_billing_type_floating_ip_cost',
      );
    });

    it('should show floating IP cost text in monthly tile when isFloatingIpsEnabled is true', () => {
      const props = {
        ...defaultProps,
        monthlyPrice: 15,
        isFloatingIpsEnabled: true,
        priceFloatingIp: { hour: 0.5, month: 365 },
      };
      const { getByTestId } = render(<BillingStep {...props} />, { wrapper });

      const monthlyTile = getByTestId('monthly_tile');

      expect(monthlyTile.innerHTML).toContain(
        'pci_projects_project_instances_configure_billing_type_floating_ip_cost',
      );
    });

    it('should not show floating IP cost text in hourly tile when priceFloatingIp is null', () => {
      const props = {
        ...defaultProps,
        price: 100,
        priceFloatingIp: null,
      };
      const { getByTestId } = render(<BillingStep {...props} />, { wrapper });

      const hourlyTile = getByTestId('hourly_tile');

      expect(hourlyTile.innerHTML).not.toContain(
        'pci_projects_project_instances_configure_billing_type_floating_ip_cost',
      );
    });

    it('should not show floating IP cost text in monthly tile when isFloatingIpsEnabled is false', () => {
      const props = {
        ...defaultProps,
        monthlyPrice: 15,
        isFloatingIpsEnabled: false,
      };
      const { getByTestId } = render(<BillingStep {...props} />, { wrapper });

      const monthlyTile = getByTestId('monthly_tile');

      expect(monthlyTile.innerHTML).not.toContain(
        'pci_projects_project_instances_configure_billing_type_floating_ip_cost',
      );
    });

    it('should calculate price with floating IP and availability zones', () => {
      const props = {
        ...defaultProps,
        price: 100,
        numberOfNodes: 2,
        selectedAvailabilityZonesNumber: 3,
        priceFloatingIp: { hour: 0.5, month: 365 },
      };
      const { getByTestId } = render(<BillingStep {...props} />, { wrapper });

      const hourlyTile = getByTestId('hourly_tile');

      // Price calculation: (3 zones * 100) + (3 zones * 2 nodes * 0.5) = 300 + 3 = 303
      expect(hourlyTile.innerHTML).toContain('303 /Hour');
    });
  });
});
