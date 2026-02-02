import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TClusterPlanEnum } from '@/types';
import { TRegionInformations } from '@/types/region';
import { wrapper } from '@/wrapperRenders';

import SizeStep from './SizeStep.component';

vi.mock('../store', () => ({
  useNewPoolStore: vi.fn(() => ({
    name: { value: 'test-pool', isTouched: true, hasError: false },
    scaling: {
      isAutoscale: false,
      quantity: { desired: 3, min: 0, max: 100 },
    },
    selectedAvailabilityZones: [{ zone: 'zone-1', checked: true }],
    attachFloatingIps: null,
    isMonthlyBilling: false,
    set: {
      selectAvailabilityZones: vi.fn(),
      attachFloatingIps: vi.fn(),
      scaling: vi.fn(),
    },
  })),
}));

vi.mock('@/hooks/useFloatingIpsPrice', () => ({
  default: vi.fn(() => ({
    price: 10,
    isPending: false,
  })),
}));

const mockUse3AZPlanAvailable = vi.fn(() => true);

vi.mock('@/hooks/use3azPlanAvaible', () => ({
  default: () => mockUse3AZPlanAvailable(),
}));

vi.mock('@/pages/new/steps/node-pool/DeploymentZone.component', () => ({
  default: () => <div data-testid="deployment-zone">DeploymentZone</div>,
}));

vi.mock('@/pages/new/steps/node-pool/NodePoolSize.component', () => ({
  default: () => <div data-testid="node-pool-size">NodePoolSize</div>,
}));

vi.mock('@/pages/new/steps/node-pool/NodePoolAntiAffinity.component', () => ({
  default: () => <div data-testid="node-pool-anti-affinity">NodePoolAntiAffinity</div>,
}));

vi.mock('@/pages/new/steps/node-pool/PublicConnectivity.component', () => ({
  default: () => <div data-testid="public-connectivity">PublicConnectivity</div>,
}));

describe('SizeStep', () => {
  const defaultProps = {
    regionInformations: null,
    selectedAvailabilityZones: null,
    antiAffinity: false,
    onAttachFloatingIPs: vi.fn(),
    onAntiAffinityChange: vi.fn(),
  };

  beforeEach(() => {
    mockUse3AZPlanAvailable.mockReturnValue(true);
  });

  it('should render NodePoolSize and NodePoolAntiAffinity components', () => {
    render(<SizeStep {...defaultProps} />, { wrapper });
    expect(screen.getByTestId('node-pool-size')).toBeInTheDocument();
    expect(screen.getByTestId('node-pool-anti-affinity')).toBeInTheDocument();
  });

  it('should render DeploymentZone when selectedAvailabilityZones is provided in store', () => {
    render(<SizeStep {...defaultProps} />, { wrapper });

    expect(screen.getByTestId('deployment-zone')).toBeInTheDocument();
  });

  describe('PublicConnectivity visibility based on plan and 3AZ feature', () => {
    const createRegionInfo = (): TRegionInformations =>
      ({
        availabilityZones: ['zone-1', 'zone-2', 'zone-3'],
        continentCode: 'EU',
        countryCode: 'FR',
        datacenterLocation: 'GRA',
        ipCountries: [],
        name: 'GRA',
        services: [],
        status: 'UP',
      }) as unknown as TRegionInformations;

    it.each([
      {
        description: 'FREE plan with 3AZ feature',
        plan: TClusterPlanEnum.FREE,
        has3AZFeature: true,
        shouldDisplay: false,
      },
      {
        description: 'STANDARD plan with 3AZ feature',
        plan: TClusterPlanEnum.STANDARD,
        has3AZFeature: true,
        shouldDisplay: true,
      },
      {
        description: 'STANDARD plan without 3AZ feature',
        plan: TClusterPlanEnum.STANDARD,
        has3AZFeature: false,
        shouldDisplay: false,
      },
      {
        description: 'FREE plan without 3AZ feature',
        plan: TClusterPlanEnum.FREE,
        has3AZFeature: false,
        shouldDisplay: false,
      },
      {
        description: 'no plan (defaults to FREE) with 3AZ feature',
        plan: undefined,
        has3AZFeature: true,
        shouldDisplay: false,
      },
    ])(
      'should $shouldDisplay render PublicConnectivity when $description',
      ({ plan, has3AZFeature, shouldDisplay }) => {
        mockUse3AZPlanAvailable.mockReturnValue(has3AZFeature);

        render(<SizeStep {...defaultProps} regionInformations={createRegionInfo()} plan={plan} />, {
          wrapper,
        });

        if (shouldDisplay) {
          expect(screen.getByTestId('public-connectivity')).toBeInTheDocument();
        } else {
          expect(screen.queryByTestId('public-connectivity')).not.toBeInTheDocument();
        }
      },
    );
  });
});
