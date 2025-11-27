import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DeploymentMode } from '@/types';
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
    attachFloatingIPs: null,
    isMonthlyBilling: false,
    set: {
      selectAvailabilityZones: vi.fn(),
      attachFloatingIPs: vi.fn(),
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
    isOpen: true,
    isChecked: false,
    isLocked: false,
    order: 1,
    regionInformations: null,
    selectedAvailabilityZones: null,
    antiAffinity: false,
    onAttachFloatingIPs: vi.fn(),
    onAntiAffinityChange: vi.fn(),
    onNext: vi.fn(),
    onEdit: vi.fn(),
  };

  it('should render NodePoolSize and NodePoolAntiAffinity components', () => {
    render(<SizeStep {...defaultProps} />, { wrapper });
    expect(screen.getByTestId('node-pool-size')).toBeInTheDocument();
    expect(screen.getByTestId('node-pool-anti-affinity')).toBeInTheDocument();
  });

  it('should render DeploymentZone when selectedAvailabilityZones is provided in store', () => {
    render(<SizeStep {...defaultProps} />, { wrapper });

    expect(screen.getByTestId('deployment-zone')).toBeInTheDocument();
  });

  describe('PublicConnectivity visibility based on deployment mode', () => {
    const createRegionInfo = (type?: DeploymentMode): TRegionInformations =>
      ({
        type,
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
        description: 'MONO_ZONE deployment',
        regionInformations: createRegionInfo(DeploymentMode.MONO_ZONE),
        shouldDisplay: false,
      },
      {
        description: 'MULTI_ZONES deployment (standard plan)',
        regionInformations: createRegionInfo(DeploymentMode.MULTI_ZONES),
        shouldDisplay: true,
      },
      {
        description: 'null regionInformations',
        regionInformations: null,
        shouldDisplay: false,
      },
    ])(
      'should $shouldDisplay render PublicConnectivity when $description',
      ({ regionInformations, shouldDisplay }) => {
        render(<SizeStep {...defaultProps} regionInformations={regionInformations} />, { wrapper });

        if (shouldDisplay) {
          expect(screen.getByTestId('public-connectivity')).toBeInTheDocument();
        } else {
          expect(screen.queryByTestId('public-connectivity')).not.toBeInTheDocument();
        }
      },
    );
  });
});
