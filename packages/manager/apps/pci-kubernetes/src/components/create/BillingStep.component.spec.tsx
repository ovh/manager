import { render, screen } from '@testing-library/react';
import { beforeEach, describe, it, vi } from 'vitest';

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

  describe.each`
    ip               | pricePublicIp               | priceFloatingIp              | numberOfNodes | hourlyLine                                                                  | monthlyLine
    ${'public_ip'}   | ${{ hour: 3, month: 2160 }} | ${null}                      | ${4}          | ${'node-pool:kube_common_node_pool_estimation_public_ip_price 12 /Hour'}    | ${'node-pool:kube_common_node_pool_estimation_public_ip_price node-pool:kube_common_node_pool_estimation_approximate_price'}
    ${'public_ip'}   | ${{ hour: 3, month: 2160 }} | ${null}                      | ${null}       | ${'node-pool:kube_common_node_pool_estimation_public_ip_price 0 /Hour'}     | ${'node-pool:kube_common_node_pool_estimation_public_ip_price node-pool:kube_common_node_pool_estimation_approximate_price'}
    ${'public_ip'}   | ${null}                     | ${null}                      | ${4}          | ${null}                                                                     | ${null}
    ${'floating_ip'} | ${null}                     | ${{ hour: 0.5, month: 365 }} | ${3}          | ${'node-pool:kube_common_node_pool_estimation_floating_ip_price 1.5 /Hour'} | ${'node-pool:kube_common_node_pool_estimation_floating_ip_price node-pool:kube_common_node_pool_estimation_approximate_price'}
    ${'floating_ip'} | ${null}                     | ${null}                      | ${3}          | ${null}                                                                     | ${null}
  `(
    'given $ip priced $pricePublicIp / $priceFloatingIp over $numberOfNodes nodes',
    ({
      ip,
      pricePublicIp,
      priceFloatingIp,
      numberOfNodes,
      hourlyLine,
      monthlyLine,
    }: {
      ip: string;
      pricePublicIp: TBillingStepProps['pricePublicIp'];
      priceFloatingIp: TBillingStepProps['priceFloatingIp'];
      numberOfNodes: number | null;
      hourlyLine: string | null;
      monthlyLine: string | null;
    }) => {
      describe('when rendering the billing tiles', () => {
        beforeEach(() => {
          render(
            <BillingStep
              {...defaultProps}
              price={100}
              monthlyPrice={15}
              numberOfNodes={numberOfNodes}
              pricePublicIp={pricePublicIp}
              priceFloatingIp={priceFloatingIp}
            />,
            { wrapper },
          );
        });

        it('states the node pool IP total in the hourly tile', () => {
          expect(screen.queryByTestId(`hourly_${ip}`)?.textContent ?? null).toBe(hourlyLine);
        });

        it('states the node pool IP total in the monthly tile', () => {
          expect(screen.queryByTestId(`monthly_${ip}`)?.textContent ?? null).toBe(monthlyLine);
        });
      });
    },
  );

  describe('Floating IP cost', () => {
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

  describe('Local storage and public IP cost', () => {
    it('should state the local storage node pool total as a price of its own', () => {
      const props = {
        ...defaultProps,
        price: 100,
        monthlyPrice: 15,
        numberOfNodes: 3,
        priceLocalStorage: { hour: 2, month: 1440 },
      };
      const { getByTestId } = render(<BillingStep {...props} />, { wrapper });

      expect(getByTestId('hourly_local_storage').innerHTML).toContain('6 /Hour');
      expect(getByTestId('monthly_local_storage')).toBeInTheDocument();
    });

    it('should state local storage at zero when the catalog does not price the volume', () => {
      const props = {
        ...defaultProps,
        price: 100,
        monthlyPrice: 15,
        numberOfNodes: 3,
        priceLocalStorage: { hour: 0, month: 0 },
      };
      const { getByTestId } = render(<BillingStep {...props} />, { wrapper });

      expect(getByTestId('hourly_local_storage').innerHTML).toContain('0 /Hour');
      expect(getByTestId('monthly_local_storage')).toBeInTheDocument();
    });

    it('should not show a local storage line when the flavor carries no volume', () => {
      const props = {
        ...defaultProps,
        price: 100,
        monthlyPrice: 15,
        numberOfNodes: 3,
        priceLocalStorage: null,
      };
      const { queryByTestId } = render(<BillingStep {...props} />, { wrapper });

      expect(queryByTestId('hourly_local_storage')).not.toBeInTheDocument();
      expect(queryByTestId('monthly_local_storage')).not.toBeInTheDocument();
    });

    it('should add local storage and public IP to the hourly node pool total', () => {
      const props = {
        ...defaultProps,
        price: 100,
        numberOfNodes: 2,
        pricePublicIp: { hour: 3, month: 2160 },
        priceLocalStorage: { hour: 2, month: 1440 },
      };
      const { getByTestId } = render(<BillingStep {...props} />, { wrapper });

      expect(getByTestId('hourly_tile').innerHTML).toContain('110 /Hour');
    });
  });
});
