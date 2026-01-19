import { describe, it, expect, vi } from 'vitest';
import { selectFlavors, TGpuFlavorDataForTable } from '../flavorsViewModel';
import { Deps } from '@/deps/deps';

const projectId = 'project-1';
const flavorType = 'type-1';
const microRegionId = 'micro-1';

const cpuFlavor = {
  name: 'd2-2',
  specifications: {
    ram: { unit: 'GB', value: 4 },
    cpu: { unit: 'vCore', value: 2 },
    disks: [
      {
        capacity: { unit: 'GB', value: 50 },
        number: 1,
      },
    ],
    bandwidth: {
      public: { unit: 'Mbit', value: 100 },
      private: { unit: 'Mbit', value: 100 },
    },
  },
  regionalizedFlavorIds: ['rf-1'],
};

const gpuFlavor = {
  name: 'l40s-90',
  specifications: {
    ram: { unit: 'GB', value: 8 },
    cpu: { unit: 'vCore', value: 4 },
    disks: [
      {
        capacity: { unit: 'GB', value: 100 },
        number: 1,
      },
    ],
    bandwidth: {
      public: { unit: 'Mbit', value: 100 },
      private: { unit: 'Mbit', value: 100 },
    },
    gpu: {
      model: { unit: 'l40s', value: 1 },
      memory: { size: { unit: 'GB', value: 16 }, interface: 'PCIe' },
    },
  },
  regionalizedFlavorIds: ['rf-2'],
};

const baseEntities = {
  flavorTypes: {
    byId: new Map([[flavorType, { flavors: ['d2-2', 'l40s-90'] }]]),
  },
  flavors: {
    byId: new Map([
      ['d2-2', cpuFlavor],
      ['l40s-90', gpuFlavor],
    ]),
  },
  regionalizedFlavors: {
    byId: new Map([
      [
        'rf-1',
        {
          id: 'd2-2_micro-1',
          regionId: microRegionId,
          flavorId: 'd2-2',
          hasStock: true,
          quota: 1,
          osTypes: ['linux'],
          tags: null,
        },
      ],
      [
        'rf-2',
        {
          id: 'l40s-90_micro-1',
          regionId: microRegionId,
          flavorId: 'l40s-90',
          hasStock: false,
          quota: 1,
          osTypes: [],
          tags: null,
        },
      ],
    ]),
  },
  microRegions: {
    byId: new Map([[microRegionId, { macroRegionId: 'macro-1' }]]),
  },
  macroRegions: {
    byId: new Map([
      [
        'macro-1',
        {
          deploymentMode: 'public',
          continentIds: ['eu'],
          country: 'FR',
          name: 'fr',
        },
      ],
    ]),
  },
  flavorPrices: {
    byId: new Map([
      [
        'd2-2_micro-1_linux_price',
        {
          id: 'd2-2_micro-1_linux_price',
          prices: [
            {
              type: 'hour',
              includeVat: false,
              price: {
                priceInUcents: 10,
                currencyCode: 'EUR',
                text: '0.10',
                value: 0.1,
              },
              monthlyEquivalent: null,
            },
            {
              type: 'month',
              includeVat: false,
              price: {
                priceInUcents: 200,
                currencyCode: 'EUR',
                text: '2.00',
                value: 2,
              },
              monthlyEquivalent: null,
            },
          ],
        },
      ],
    ]),
  },
};

const fakeDeps: Deps = {
  instancesCatalogPort: {
    selectInstancesCatalog: vi.fn().mockReturnValue({
      entities: baseEntities,
    }),
  },
  instancePort: { createInstance: vi.fn() },
};

const createDepsWithoutPrices = (): Deps => ({
  ...fakeDeps,
  instancesCatalogPort: {
    selectInstancesCatalog: vi.fn().mockReturnValue({
      entities: {
        ...baseEntities,
        flavorPrices: {
          byId: new Map(),
        },
      },
    }),
  },
});

const createFlavorSelectionArgs = (customArgs = {}) => ({
  projectId,
  flavorCategory: 'General Purpose',
  flavorType,
  microRegionId,
  withUnavailable: false,
  ...customArgs,
});

describe('selectFlavors - non-GPU category', () => {
  it('should returns empty result when required args are missing', () => {
    const result = selectFlavors(fakeDeps)(
      createFlavorSelectionArgs({ flavorType: null }),
    );
    expect(result).toEqual({
      flavors: [],
      preselectedFlavordId: null,
      isGpu: false,
    });
  });

  it('should returns available cpu flavors with isGpu false', () => {
    const result = selectFlavors(fakeDeps)(createFlavorSelectionArgs());
    const cpuFlavorResult = result.flavors.find((f) => f.name === 'd2-2');

    expect(result.isGpu).toBe(false);
    expect(result.flavors.length).toBeGreaterThan(0);
    expect(cpuFlavorResult).toMatchObject({
      id: 'd2-2_micro-1',
      name: 'd2-2',
      unavailable: false,
      unavailableQuota: false,
      realMinimumHourlyPrice: 10,
      realMinimumMonthlyPrice: 200,
    });
    expect(result.preselectedFlavordId).toBe('d2-2_micro-1');
  });

  it('should add unavailable cpu flavor when enabled', () => {
    const result = selectFlavors(fakeDeps)(
      createFlavorSelectionArgs({ withUnavailable: true }),
    );
    expect(result.flavors.some((f) => f.unavailable)).toBe(true);
  });

  it('should calculate minimum prices correctly from flavor prices', () => {
    const result = selectFlavors(fakeDeps)(createFlavorSelectionArgs());
    const cpuFlavorResult = result.flavors.find((f) => f.name === 'd2-2');

    expect(cpuFlavorResult?.realMinimumHourlyPrice).toBe(10);
    expect(cpuFlavorResult?.realMinimumMonthlyPrice).toBe(200);
  });

  it('should return null prices when no pricing data exists', () => {
    const result = selectFlavors(createDepsWithoutPrices())(
      createFlavorSelectionArgs(),
    );
    const cpuFlavorResult = result.flavors.find((f) => f.name === 'd2-2');

    expect(cpuFlavorResult?.realMinimumHourlyPrice).toBeNull();
    expect(cpuFlavorResult?.realMinimumMonthlyPrice).toBeNull();
  });
});

describe('selectFlavors - GPU flavors', () => {
  it('should returns gpu flavors with gpu fields and isGpu true', () => {
    const result = selectFlavors(fakeDeps)({
      projectId,
      flavorCategory: 'Cloud GPU',
      flavorType,
      microRegionId,
      withUnavailable: true,
    });

    expect(result.isGpu).toBe(true);

    const gpuFlavorResult = result.flavors.find(
      (f) => f.name === 'l40s-90',
    ) as TGpuFlavorDataForTable;

    expect(gpuFlavorResult).toMatchObject({
      name: 'l40s-90',
      gpu: 'l40s',
      numberOfGpu: 1,
      vRamTotal: 16,
      realMinimumHourlyPrice: null,
      realMinimumMonthlyPrice: null,
    });
  });

  it('should return empty result with isGpu true when no data', () => {
    const emptyDeps: Deps = {
      ...fakeDeps,
      instancesCatalogPort: {
        selectInstancesCatalog: vi.fn().mockReturnValue(null),
      },
    };

    const result = selectFlavors(emptyDeps)({
      projectId,
      flavorCategory: 'Cloud GPU',
      flavorType,
      microRegionId,
      withUnavailable: false,
    });

    expect(result).toEqual({
      flavors: [],
      preselectedFlavordId: null,
      isGpu: true,
    });
  });
});
