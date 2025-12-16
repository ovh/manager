import { describe, expect, it, vi } from 'vitest';

import { TProductAvailability } from '@/types';

import { transformToRegions } from './usePlanToRegionAvailability';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useProductAvailability: vi.fn(),
}));

vi.mock('@/hooks/useStandardPlanAvailable', () => ({
  default: vi.fn(),
}));

const createMockPlan = (
  code: string,
  regions: Array<{
    name: string;
    datacenter?: string;
    continentCode?: string;
    enabled?: boolean;
    type?: string;
    availabilityZones?: string[];
  }>,
) => ({
  code,
  regions: regions.map((region) => ({
    name: region.name,
    datacenter: region.datacenter ?? 'DC1',
    continentCode: region.continentCode ?? 'EU',
    enabled: region.enabled ?? true,
    type: region.type ?? 'region',
    availabilityZones: region.availabilityZones ?? [],
  })),
});

const createMockAvailability = (
  plans: TProductAvailability['plans'] = [],
): TProductAvailability => ({
  plans,
  products: [],
});
describe('transformToRegions', () => {
  it.each([
    {
      standardIsActivated: false,
      plans: [
        createMockPlan('kubernetes.free', [{ name: 'GRA' }]),
        createMockPlan('kubernetes.standard', [{ name: 'GRA' }]),
      ],
      expectedCodes: ['kubernetes.free'],
      description: 'only FREE plans when standard is deactivated',
    },
    {
      standardIsActivated: false,
      plans: [
        createMockPlan('kubernetes.standard.3az', [{ name: 'GRA' }]),
        createMockPlan('kubernetes.standard', [{ name: 'GRA' }]),
      ],
      expectedCodes: ['kubernetes.standard.3az'],
      description: 'only .3az plans when standard is deactivated',
    },
    {
      standardIsActivated: false,
      plans: [
        createMockPlan('kubernetes.free', [{ name: 'GRA' }]),
        createMockPlan('kubernetes.standard.3az', [{ name: 'GRA' }]),
        createMockPlan('kubernetes.standard', [{ name: 'GRA' }]),
      ],
      expectedCodes: ['kubernetes.free', 'kubernetes.standard.3az'],
      description: 'both FREE and .3az plans when standard is deactivated',
    },
    {
      standardIsActivated: true,
      plans: [
        createMockPlan('kubernetes.free', [{ name: 'GRA' }]),
        createMockPlan('kubernetes.standard', [{ name: 'GRA' }]),
        createMockPlan('kubernetes.premium', [{ name: 'GRA' }]),
      ],
      expectedCodes: ['kubernetes.free', 'kubernetes.standard', 'kubernetes.premium'],
      description: 'all plans when standard is activated',
    },
  ])('should include $description', ({ standardIsActivated, plans, expectedCodes }) => {
    const result = transformToRegions(
      createMockAvailability(plans as TProductAvailability['plans']),
      standardIsActivated,
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.codes).toEqual(expectedCodes);
  });
});
