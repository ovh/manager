import { describe, expect, it, vi } from 'vitest';

import { TClusterPlanCodeEnum } from '@/types';
import { TProductAvailability } from '@/types/region';

import { transformToRegions } from './usePlanToRegionAvailability';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useProductAvailability: vi.fn(),
}));

vi.mock('@/hooks/useStandardPlanAvailable', () => ({
  default: vi.fn(),
}));

const createMockPlan = (
  code: TClusterPlanCodeEnum,
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
        createMockPlan(TClusterPlanCodeEnum.FREE1AZ, [{ name: 'GRA' }]),
        createMockPlan(TClusterPlanCodeEnum.STANDARD1AZ, [{ name: 'GRA' }]),
      ],
      expectedCodes: [TClusterPlanCodeEnum.FREE1AZ],
      description: 'only FREE1AZ plans when standard is deactivated',
    },
    {
      standardIsActivated: false,
      plans: [
        createMockPlan(TClusterPlanCodeEnum.STANDARD3AZ, [{ name: 'GRA' }]),
        createMockPlan(TClusterPlanCodeEnum.STANDARD1AZ, [{ name: 'GRA' }]),
      ],
      expectedCodes: [TClusterPlanCodeEnum.STANDARD3AZ],
      description: 'only STANDARD3AZ plans when standard is deactivated',
    },
    {
      standardIsActivated: false,
      plans: [
        createMockPlan(TClusterPlanCodeEnum.FREE1AZ, [{ name: 'GRA' }]),
        createMockPlan(TClusterPlanCodeEnum.STANDARD3AZ, [{ name: 'GRA' }]),
        createMockPlan(TClusterPlanCodeEnum.STANDARD1AZ, [{ name: 'GRA' }]),
      ],
      expectedCodes: [TClusterPlanCodeEnum.FREE1AZ, TClusterPlanCodeEnum.STANDARD3AZ],
      description: 'both FREE1AZ and STANDARD3AZ plans when standard is deactivated',
    },
    {
      standardIsActivated: true,
      plans: [
        createMockPlan(TClusterPlanCodeEnum.FREE1AZ, [{ name: 'GRA' }]),
        createMockPlan(TClusterPlanCodeEnum.STANDARD1AZ, [{ name: 'GRA' }]),
        createMockPlan(TClusterPlanCodeEnum.STANDARD3AZ, [{ name: 'GRA' }]),
      ],
      expectedCodes: [
        TClusterPlanCodeEnum.FREE1AZ,
        TClusterPlanCodeEnum.STANDARD1AZ,
        TClusterPlanCodeEnum.STANDARD3AZ,
      ],
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
