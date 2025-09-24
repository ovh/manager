import { describe, expect, it } from 'vitest';
import { TRegionAvailability } from '@ovh-ux/manager-pci-common';
import {
  filterAllowedRegions,
  groupRegionsByContinent,
  ProductAvailability,
  ProjectRegion,
  RegionFilterCriteria,
} from './regionFilter';
import { OBJECT_CONTAINER_OFFER_STORAGE_STANDARD } from '@/constants';

describe('filterAllowedRegions', () => {
  const mockRegions: TRegionAvailability[] = [
    {
      name: 'EU-WEST-1',
      type: 'region-3-az',
      enabled: true,
      datacenter: 'EU-WEST',
      continentCode: 'EU',
      availabilityZones: [],
    },
    {
      name: 'EU-WEST',
      type: 'region',
      enabled: true,
      datacenter: 'EU-WEST',
      continentCode: 'EU',
      availabilityZones: [],
    },
    {
      name: 'US-EAST-1',
      type: 'localzone',
      enabled: true,
      datacenter: 'US-EAST',
      continentCode: 'NA',
      availabilityZones: [],
    },
    {
      name: 'ASIA-1',
      type: 'region',
      enabled: false,
      datacenter: 'ASIA',
      continentCode: 'AS',
      availabilityZones: [],
    },
    {
      name: 'EU-CENTRAL',
      type: 'region-3-az',
      enabled: true,
      datacenter: 'EU-CENTRAL',
      continentCode: 'EU',
      availabilityZones: [],
    },
  ];

  const mockProductAvailability: ProductAvailability = {
    plans: [
      {
        code: 'storage-standard',
        regions: mockRegions,
      },
      {
        code: 'storage-swift',
        regions: mockRegions.slice(0, 3),
      },
      {
        code: 'non-storage-plan',
        regions: mockRegions,
      },
    ],
  };

  const mockProjectRegions: ProjectRegion[] = [
    {
      name: 'EU-WEST-1',
      services: [{ name: 'storage-swift' }, { name: 'storage-standard' }],
    },
    {
      name: 'US-EAST-1',
      services: [{ name: 'storage-standard' }],
    },
  ];

  describe('basic filtering', () => {
    it('should return empty array when availability is null', () => {
      const result = filterAllowedRegions(null, mockProjectRegions);
      expect(result).toEqual([]);
    });

    it('should return empty array when plans is undefined', () => {
      const result = filterAllowedRegions({}, mockProjectRegions);
      expect(result).toEqual([]);
    });

    it('should return empty array when plans is empty', () => {
      const result = filterAllowedRegions({ plans: [] }, mockProjectRegions);
      expect(result).toEqual([]);
    });
  });

  describe('deployment mode filtering', () => {
    it('should filter by deployment mode (default: region)', () => {
      const result = filterAllowedRegions(
        mockProductAvailability,
        mockProjectRegions,
      );

      result.forEach((region) => {
        expect(region.type).toBe('region');
      });
    });

    it('should filter by specific deployment mode', () => {
      const criteria: RegionFilterCriteria = {
        deploymentMode: 'region-3-az',
      };

      const result = filterAllowedRegions(
        mockProductAvailability,
        mockProjectRegions,
        criteria,
      );

      result.forEach((region) => {
        expect(region.type).toBe('region-3-az');
      });
    });

    it('should filter by localzone deployment mode', () => {
      const criteria: RegionFilterCriteria = {
        deploymentMode: 'localzone',
      };

      const result = filterAllowedRegions(
        mockProductAvailability,
        mockProjectRegions,
        criteria,
      );

      result.forEach((region) => {
        expect(region.type).toBe('localzone');
      });
    });
  });

  describe('enabled/disabled filtering', () => {
    it('should filter only enabled regions by default', () => {
      const result = filterAllowedRegions(
        mockProductAvailability,
        mockProjectRegions,
      );

      result.forEach((region) => {
        expect(region.enabled).toBe(true);
      });
    });

    it('should include disabled regions when onlyEnabled is false', () => {
      const criteria: RegionFilterCriteria = {
        onlyEnabled: false,
      };

      const result = filterAllowedRegions(
        mockProductAvailability,
        mockProjectRegions,
        criteria,
      );

      const disabledRegions = result.filter((region) => !region.enabled);
      expect(disabledRegions.length).toEqual(1);
    });
  });

  describe('offer-based filtering', () => {
    it('should use default storage standard offer', () => {
      const result = filterAllowedRegions(
        mockProductAvailability,
        mockProjectRegions,
      );

      expect(result.length).toEqual(1);
    });

    it('should filter by specific offer', () => {
      const criteria: RegionFilterCriteria = {
        offer: 'storage-swift',
      };

      const result = filterAllowedRegions(
        mockProductAvailability,
        mockProjectRegions,
        criteria,
      );

      // Should only include regions where the project has the swift service
      result.forEach((region) => {
        const projectRegion = mockProjectRegions.find(
          (pr) => pr.name === region.name,
        );
        if (projectRegion) {
          const hasService = projectRegion.services.some(
            (service) => service.name === 'storage-swift',
          );
          expect(hasService).toBe(true);
        }
      });
    });

    it('should exclude regions without required service for non-standard offers', () => {
      const criteria: RegionFilterCriteria = {
        offer: 'storage-swift',
        deploymentMode: 'localzone',
      };

      const result = filterAllowedRegions(
        mockProductAvailability,
        mockProjectRegions,
        criteria,
      );

      // US-EAST-1 doesn't have storage-swift service, so should be excluded
      const usEastRegion = result.find((region) => region.name === 'US-EAST-1');
      expect(usEastRegion).toBeUndefined();
    });
  });

  describe('macro/micro region filtering', () => {
    it('should remove macro regions when micro regions available by default', () => {
      const regionsWithMacroMicro: TRegionAvailability[] = [
        {
          name: 'EU-WEST',
          type: 'region',
          enabled: true,
          datacenter: 'EU-WEST',
          continentCode: 'EU',
          availabilityZones: [],
        },
        {
          name: 'EU-WEST-1',
          type: 'region',
          enabled: true,
          datacenter: 'EU-WEST',
          continentCode: 'EU',
          availabilityZones: [],
        },
        {
          name: 'EU-WEST-2',
          type: 'region',
          enabled: true,
          datacenter: 'EU-WEST',
          continentCode: 'EU',
          availabilityZones: [],
        },
      ];

      const availability: ProductAvailability = {
        plans: [{ code: 'storage-standard', regions: regionsWithMacroMicro }],
      };

      const result = filterAllowedRegions(availability, null);

      // Should exclude EU-WEST (macro) because EU-WEST-1 and EU-WEST-2 (micro) exist
      const macroRegion = result.find((region) => region.name === 'EU-WEST');
      expect(macroRegion).toBeUndefined();

      const microRegions = result.filter((region) =>
        region.name.startsWith('EU-WEST-'),
      );
      expect(microRegions.length).toBe(2);
    });

    it('should keep macro region when no micro regions available', () => {
      const regionsWithOnlyMacro: TRegionAvailability[] = [
        {
          name: 'EU-WEST',
          type: 'region',
          enabled: true,
          datacenter: 'EU-WEST',
          continentCode: 'EU',
          availabilityZones: [],
        },
      ];

      const availability: ProductAvailability = {
        plans: [{ code: 'storage-standard', regions: regionsWithOnlyMacro }],
      };

      const result = filterAllowedRegions(availability, null);

      // Should keep EU-WEST because no micro regions exist
      const macroRegion = result.find((region) => region.name === 'EU-WEST');
      expect(macroRegion).toBeDefined();
    });

    it('should not remove macro regions when removeMacroIfMicroAvailable is false', () => {
      const regionsWithMacroMicro: TRegionAvailability[] = [
        {
          name: 'EU-WEST',
          type: 'region',
          enabled: true,
          datacenter: 'EU-WEST',
          continentCode: 'EU',
          availabilityZones: [],
        },
        {
          name: 'EU-WEST-1',
          type: 'region',
          enabled: true,
          datacenter: 'EU-WEST',
          continentCode: 'EU',
          availabilityZones: [],
        },
      ];

      const availability: ProductAvailability = {
        plans: [{ code: 'storage-standard', regions: regionsWithMacroMicro }],
      };

      const criteria: RegionFilterCriteria = {
        removeMacroIfMicroAvailable: false,
      };

      const result = filterAllowedRegions(availability, null, criteria);

      // Should keep both macro and micro regions
      const macroRegion = result.find((region) => region.name === 'EU-WEST');
      const microRegion = result.find((region) => region.name === 'EU-WEST-1');
      expect(macroRegion).toBeDefined();
      expect(microRegion).toBeDefined();
    });
  });

  describe('region exclusion', () => {
    it('should exclude specified region', () => {
      const criteria: RegionFilterCriteria = {
        excludeRegion: 'EU-WEST-1',
        deploymentMode: 'region-3-az',
      };

      const result = filterAllowedRegions(
        mockProductAvailability,
        mockProjectRegions,
        criteria,
      );

      const excludedRegion = result.find(
        (region) => region.name === 'EU-WEST-1',
      );
      expect(excludedRegion).toBeUndefined();
    });

    it('should not exclude region when excludeRegion is not specified', () => {
      const criteria: RegionFilterCriteria = {
        deploymentMode: 'region-3-az',
      };

      const result = filterAllowedRegions(
        mockProductAvailability,
        mockProjectRegions,
        criteria,
      );

      const targetRegion = result.find((region) => region.name === 'EU-WEST-1');
      expect(targetRegion).toBeDefined();
    });
  });

  describe('duplicate region handling', () => {
    it('should handle duplicate regions and keep unique ones', () => {
      const duplicateRegions: TRegionAvailability[] = [
        {
          name: 'EU-WEST-1',
          type: 'region',
          enabled: true,
          datacenter: 'EU-WEST',
          continentCode: 'EU',
          availabilityZones: [],
        },
        {
          name: 'EU-WEST-1', // Duplicate
          type: 'region',
          enabled: true,
          datacenter: 'EU-WEST',
          continentCode: 'EU',
          availabilityZones: [],
        },
        {
          name: 'US-EAST-1',
          type: 'region',
          enabled: true,
          datacenter: 'US-EAST',
          continentCode: 'NA',
          availabilityZones: [],
        },
      ];

      const availability: ProductAvailability = {
        plans: [{ code: 'storage-standard', regions: duplicateRegions }],
      };

      const result = filterAllowedRegions(availability, null);

      // Should only have unique regions
      const regionNames = result.map((region) => region.name);
      const uniqueNames = [...new Set(regionNames)];
      expect(regionNames.length).toBe(uniqueNames.length);
    });
  });

  describe('complex filtering scenarios', () => {
    it('should apply multiple filters correctly', () => {
      const criteria: RegionFilterCriteria = {
        offer: OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
        deploymentMode: 'region-3-az',
        onlyEnabled: true,
        excludeRegion: 'EU-CENTRAL',
        removeMacroIfMicroAvailable: true,
      };

      const result = filterAllowedRegions(
        mockProductAvailability,
        mockProjectRegions,
        criteria,
      );

      result.forEach((region) => {
        expect(region.type).toBe('region-3-az');
        expect(region.enabled).toBe(true);
        expect(region.name).not.toBe('EU-CENTRAL');
      });
    });
  });
});

describe('groupRegionsByContinent', () => {
  interface TestRegion {
    name: string;
    continent: string;
  }

  const mockRegions: TestRegion[] = [
    { name: 'EU-WEST-1', continent: 'Europe' },
    { name: 'EU-CENTRAL', continent: 'Europe' },
    { name: 'US-EAST-1', continent: 'North America' },
    { name: 'US-WEST-1', continent: 'North America' },
    { name: 'ASIA-1', continent: 'Asia' },
  ];

  it('should group regions by continent', () => {
    const result = groupRegionsByContinent(
      mockRegions,
      (region) => region.continent,
    );

    expect(result).toEqual({
      Europe: [
        { name: 'EU-WEST-1', continent: 'Europe' },
        { name: 'EU-CENTRAL', continent: 'Europe' },
      ],
      'North America': [
        { name: 'US-EAST-1', continent: 'North America' },
        { name: 'US-WEST-1', continent: 'North America' },
      ],
      Asia: [{ name: 'ASIA-1', continent: 'Asia' }],
    });
  });

  it('should handle empty regions array', () => {
    const result = groupRegionsByContinent([], (region) => region.continent);
    expect(result).toEqual({});
  });

  it('should handle single region', () => {
    const singleRegion = [{ name: 'EU-WEST-1', continent: 'Europe' }];
    const result = groupRegionsByContinent(
      singleRegion,
      (region) => region.continent,
    );

    expect(result).toEqual({
      Europe: [{ name: 'EU-WEST-1', continent: 'Europe' }],
    });
  });

  it('should handle regions with same continent', () => {
    const sameContinent = [
      { name: 'EU-WEST-1', continent: 'Europe' },
      { name: 'EU-CENTRAL', continent: 'Europe' },
    ];
    const result = groupRegionsByContinent(
      sameContinent,
      (region) => region.continent,
    );

    expect(result).toEqual({
      Europe: [
        { name: 'EU-WEST-1', continent: 'Europe' },
        { name: 'EU-CENTRAL', continent: 'Europe' },
      ],
    });
  });

  it('should work with different continent name extraction logic', () => {
    const regionsWithCodes = [
      { name: 'EU-WEST-1', continent: 'EU' },
      { name: 'US-EAST-1', continent: 'NA' },
    ];

    const continentMapping = {
      EU: 'Europe',
      NA: 'North America',
    };

    const result = groupRegionsByContinent(
      regionsWithCodes,
      (region) =>
        continentMapping[region.continent as keyof typeof continentMapping] ||
        region.continent,
    );

    expect(result).toEqual({
      Europe: [{ name: 'EU-WEST-1', continent: 'EU' }],
      'North America': [{ name: 'US-EAST-1', continent: 'NA' }],
    });
  });

  it('should handle regions with undefined or null continent names', () => {
    interface RegionWithOptionalContinent {
      name: string;
      continent?: string;
    }

    const regionsWithMissingData: RegionWithOptionalContinent[] = [
      { name: 'EU-WEST-1', continent: 'Europe' },
      { name: 'UNKNOWN-1' }, // No continent
      { name: 'NULL-1', continent: undefined },
    ];

    const result = groupRegionsByContinent(
      regionsWithMissingData,
      (region) => region.continent || 'Unknown',
    );

    expect(result).toEqual({
      Europe: [{ name: 'EU-WEST-1', continent: 'Europe' }],
      Unknown: [
        { name: 'UNKNOWN-1' },
        { name: 'NULL-1', continent: undefined },
      ],
    });
  });
});
