/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
import { describe, expect, it } from 'vitest';
import { selectImagesFromCatalog } from '../imagesViewModel';
import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';
import { TOsType } from '@/domain/entities/common.types';

const MICRO_REGION = 'GRA11';

const createCatalog = ({
  flavors,
}: {
  flavors: Array<{
    regionalizedFlavorId: string;
    flavorId: string;
    osTypes: TOsType[];
    stockOsTypes: TOsType[];
  }>;
}): TInstancesCatalog => {
  const regionalizedFlavorsById = new Map();
  const regionalizedFlavorOsTypesById = new Map();
  const flavorsById = new Map();

  flavors.forEach(
    ({ regionalizedFlavorId, flavorId, osTypes, stockOsTypes }) => {
      regionalizedFlavorsById.set(regionalizedFlavorId, {
        id: regionalizedFlavorId,
        regionId: MICRO_REGION,
        flavorId,
        hasStock: true,
        quota: 100,
        osTypes,
        tags: [],
      });

      stockOsTypes.forEach((osType) => {
        const osTypeId = `${regionalizedFlavorId}_${osType}`;
        regionalizedFlavorOsTypesById.set(osTypeId, {
          id: osTypeId,
          flavorId: `${flavorId}-uuid-${osType}`,
          osType,
          hasStock: true,
          quota: 100,
        });
      });

      flavorsById.set(flavorId, {
        name: flavorId,
        specifications: {
          cpu: { unit: 'vCore', value: 4 },
          ram: { unit: 'GB', value: 8 },
          bandwidth: {
            public: { unit: 'Mbit', value: 1000 },
            private: { unit: 'Mbit', value: 1000 },
          },
          disks: [{ capacity: { unit: 'GB', value: 50 }, number: 1 }],
        },
        regionalizedFlavorIds: [regionalizedFlavorId],
      });
    },
  );

  const imagesById = new Map([
    [
      'Ubuntu 22.04',
      { id: 'Ubuntu 22.04', osType: 'linux' as TOsType, variant: 'Ubuntu' },
    ],
    [
      'Ubuntu 24.04',
      { id: 'Ubuntu 24.04', osType: 'linux' as TOsType, variant: 'Ubuntu' },
    ],
    [
      'Baremetal - Ubuntu 22.04',
      {
        id: 'Baremetal - Ubuntu 22.04',
        osType: 'baremetal-linux' as TOsType,
        variant: 'Ubuntu',
      },
    ],
    [
      'Baremetal - Ubuntu 24.04',
      {
        id: 'Baremetal - Ubuntu 24.04',
        osType: 'baremetal-linux' as TOsType,
        variant: 'Ubuntu',
      },
    ],
    [
      'Debian 12',
      { id: 'Debian 12', osType: 'linux' as TOsType, variant: 'Debian' },
    ],
    [
      'Baremetal - Debian 12',
      {
        id: 'Baremetal - Debian 12',
        osType: 'baremetal-linux' as TOsType,
        variant: 'Debian',
      },
    ],
    [
      'FreeBSD 14',
      { id: 'FreeBSD 14', osType: 'bsd' as TOsType, variant: 'FreeBSD' },
    ],
    [
      'Windows Server 2022',
      {
        id: 'Windows Server 2022',
        osType: 'windows' as TOsType,
        variant: 'windows',
      },
    ],
  ]);

  const regionalizedImagesById = new Map([
    [
      `Ubuntu 22.04_${MICRO_REGION}`,
      {
        id: `Ubuntu 22.04_${MICRO_REGION}`,
        imageId: 'ubuntu-2204-uuid',
      },
    ],
    [
      `Ubuntu 24.04_${MICRO_REGION}`,
      {
        id: `Ubuntu 24.04_${MICRO_REGION}`,
        imageId: 'ubuntu-2404-uuid',
      },
    ],
    [
      `Baremetal - Ubuntu 22.04_${MICRO_REGION}`,
      {
        id: `Baremetal - Ubuntu 22.04_${MICRO_REGION}`,
        imageId: 'bm-ubuntu-2204-uuid',
      },
    ],
    [
      `Baremetal - Ubuntu 24.04_${MICRO_REGION}`,
      {
        id: `Baremetal - Ubuntu 24.04_${MICRO_REGION}`,
        imageId: 'bm-ubuntu-2404-uuid',
      },
    ],
    [
      `Debian 12_${MICRO_REGION}`,
      {
        id: `Debian 12_${MICRO_REGION}`,
        imageId: 'debian-12-uuid',
      },
    ],
    [
      `Baremetal - Debian 12_${MICRO_REGION}`,
      {
        id: `Baremetal - Debian 12_${MICRO_REGION}`,
        imageId: 'bm-debian-12-uuid',
      },
    ],
    [
      `FreeBSD 14_${MICRO_REGION}`,
      {
        id: `FreeBSD 14_${MICRO_REGION}`,
        imageId: 'freebsd-14-uuid',
      },
    ],
    [
      `Windows Server 2022_${MICRO_REGION}`,
      {
        id: `Windows Server 2022_${MICRO_REGION}`,
        imageId: 'win-2022-uuid',
      },
    ],
  ]);

  const imageTypesById = new Map([
    [
      'linux',
      {
        id: 'linux',
        imageIds: [
          'Ubuntu 22.04',
          'Ubuntu 24.04',
          'Baremetal - Ubuntu 22.04',
          'Baremetal - Ubuntu 24.04',
          'Debian 12',
          'Baremetal - Debian 12',
          'FreeBSD 14',
        ],
      },
    ],
    [
      'windows',
      {
        id: 'windows',
        imageIds: ['Windows Server 2022'],
      },
    ],
  ]);

  return ({
    entities: {
      flavors: { byId: flavorsById, allIds: [...flavorsById.keys()] },
      regionalizedFlavors: {
        byId: regionalizedFlavorsById,
        allIds: [...regionalizedFlavorsById.keys()],
      },
      regionalizedFlavorOsTypes: {
        byId: regionalizedFlavorOsTypesById,
        allIds: [...regionalizedFlavorOsTypesById.keys()],
      },
      flavorPrices: { byId: new Map(), allIds: [] },
      imageTypes: {
        byId: imageTypesById,
        allIds: [...imageTypesById.keys()],
      },
      images: { byId: imagesById, allIds: [...imagesById.keys()] },
      regionalizedImages: {
        byId: regionalizedImagesById,
        allIds: [...regionalizedImagesById.keys()],
      },
    },
  } as unknown) as TInstancesCatalog;
};

const BEST_SELLERS_FLAVOR = {
  regionalizedFlavorId: 'b3-8_GRA11',
  flavorId: 'b3-8',
  osTypes: ['linux', 'windows'] as TOsType[],
  stockOsTypes: ['linux', 'windows'] as TOsType[],
};

const METAL_FLAVOR = {
  regionalizedFlavorId: 'bm-8_GRA11',
  flavorId: 'bm-8',
  osTypes: ['baremetal-linux'] as TOsType[],
  stockOsTypes: ['baremetal-linux'] as TOsType[],
};

const BSD_FLAVOR = {
  regionalizedFlavorId: 'bsd-4_GRA11',
  flavorId: 'bsd-4',
  osTypes: ['linux', 'bsd'] as TOsType[],
  stockOsTypes: ['linux', 'bsd'] as TOsType[],
};

const baseArgs = {
  projectId: 'project-1',
  selectedImageType: 'linux' as const,
  microRegion: MICRO_REGION,
  distributionImageVariantId: null,
};

describe('selectImagesFromCatalog', () => {
  describe('with a best sellers (linux) flavor', () => {
    const catalog = createCatalog({ flavors: [BEST_SELLERS_FLAVOR] });

    it('returns variants with osType linux and available', () => {
      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: BEST_SELLERS_FLAVOR.regionalizedFlavorId,
      });

      const ubuntu = result.images.find((img) => img.value === 'Ubuntu');
      const debian = result.images.find((img) => img.value === 'Debian');

      expect(ubuntu?.osType).toBe('linux');
      expect(ubuntu?.available).toBe(true);
      expect(debian?.osType).toBe('linux');
      expect(debian?.available).toBe(true);
    });

    it('returns linux regionalized image IDs for Ubuntu versions', () => {
      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: BEST_SELLERS_FLAVOR.regionalizedFlavorId,
        distributionImageVariantId: 'Ubuntu',
      });

      const availableVersionValues = result.versions
        .filter((v) => !v.disabled)
        .map((v) => v.value);

      expect(availableVersionValues).toContain('ubuntu-2204-uuid');
      expect(availableVersionValues).toContain('ubuntu-2404-uuid');
      expect(availableVersionValues).not.toContain('bm-ubuntu-2204-uuid');
      expect(availableVersionValues).not.toContain('bm-ubuntu-2404-uuid');
    });

    it('preselects the first available variant with osType linux', () => {
      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: BEST_SELLERS_FLAVOR.regionalizedFlavorId,
      });

      expect(
        result.preselected.preselectedFirstAvailableVariantId,
      ).not.toBeNull();

      const preselectedVariant = result.images.find(
        (img) =>
          img.value === result.preselected.preselectedFirstAvailableVariantId,
      );
      expect(preselectedVariant?.osType).toBe('linux');
      expect(preselectedVariant?.available).toBe(true);
    });
  });

  describe('with a metal instances (baremetal-linux) flavor', () => {
    const catalog = createCatalog({ flavors: [METAL_FLAVOR] });

    it('returns variants with osType baremetal-linux and available', () => {
      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: METAL_FLAVOR.regionalizedFlavorId,
      });

      const ubuntu = result.images.find((img) => img.value === 'Ubuntu');
      const debian = result.images.find((img) => img.value === 'Debian');

      expect(ubuntu?.osType).toBe('baremetal-linux');
      expect(ubuntu?.available).toBe(true);
      expect(debian?.osType).toBe('baremetal-linux');
      expect(debian?.available).toBe(true);
    });

    it('returns baremetal regionalized image IDs for Ubuntu versions', () => {
      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: METAL_FLAVOR.regionalizedFlavorId,
        distributionImageVariantId: 'Ubuntu',
      });

      const availableVersionValues = result.versions
        .filter((v) => !v.disabled)
        .map((v) => v.value);

      expect(availableVersionValues).toContain('bm-ubuntu-2204-uuid');
      expect(availableVersionValues).toContain('bm-ubuntu-2404-uuid');
      expect(availableVersionValues).not.toContain('ubuntu-2204-uuid');
      expect(availableVersionValues).not.toContain('ubuntu-2404-uuid');
    });

    it('preselects the first available variant with osType baremetal-linux', () => {
      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: METAL_FLAVOR.regionalizedFlavorId,
      });

      const preselectedVariant = result.images.find(
        (img) =>
          img.value === result.preselected.preselectedFirstAvailableVariantId,
      );
      expect(preselectedVariant?.osType).toBe('baremetal-linux');
    });
  });

  describe('switching from best sellers to metal instances', () => {
    const catalog = createCatalog({
      flavors: [BEST_SELLERS_FLAVOR, METAL_FLAVOR],
    });

    it('returns linux osType for best sellers and baremetal-linux for metal on the same variant', () => {
      const bestSellersResult = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: BEST_SELLERS_FLAVOR.regionalizedFlavorId,
      });
      const metalResult = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: METAL_FLAVOR.regionalizedFlavorId,
      });

      expect(
        bestSellersResult.images.find((img) => img.value === 'Ubuntu')?.osType,
      ).toBe('linux');
      expect(
        metalResult.images.find((img) => img.value === 'Ubuntu')?.osType,
      ).toBe('baremetal-linux');
    });

    it('returns disjoint sets of regionalized image IDs per flavor', () => {
      const bestSellersResult = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: BEST_SELLERS_FLAVOR.regionalizedFlavorId,
        distributionImageVariantId: 'Ubuntu',
      });
      const metalResult = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: METAL_FLAVOR.regionalizedFlavorId,
        distributionImageVariantId: 'Ubuntu',
      });

      const bestSellersIds = bestSellersResult.versions
        .filter((v) => !v.disabled)
        .map((v) => v.value);
      const metalIds = metalResult.versions
        .filter((v) => !v.disabled)
        .map((v) => v.value);

      bestSellersIds.forEach((id) => {
        expect(metalIds).not.toContain(id);
      });
      metalIds.forEach((id) => {
        expect(bestSellersIds).not.toContain(id);
      });
    });
  });

  describe('switching from metal instances to best sellers', () => {
    const catalog = createCatalog({
      flavors: [BEST_SELLERS_FLAVOR, METAL_FLAVOR],
    });

    it('resolves osType back to linux after being on baremetal-linux', () => {
      const metalResult = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: METAL_FLAVOR.regionalizedFlavorId,
      });
      expect(
        metalResult.images.find((img) => img.value === 'Ubuntu')?.osType,
      ).toBe('baremetal-linux');

      const bestSellersResult = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: BEST_SELLERS_FLAVOR.regionalizedFlavorId,
      });
      expect(
        bestSellersResult.images.find((img) => img.value === 'Ubuntu')?.osType,
      ).toBe('linux');
    });

    it('resolves Debian osType correctly in both directions', () => {
      const metalResult = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: METAL_FLAVOR.regionalizedFlavorId,
      });
      expect(
        metalResult.images.find((img) => img.value === 'Debian')?.osType,
      ).toBe('baremetal-linux');

      const bestSellersResult = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: BEST_SELLERS_FLAVOR.regionalizedFlavorId,
      });
      expect(
        bestSellersResult.images.find((img) => img.value === 'Debian')?.osType,
      ).toBe('linux');
    });
  });

  describe('with a flavor that supports bsd', () => {
    const catalog = createCatalog({ flavors: [BSD_FLAVOR] });

    it('returns FreeBSD variant with osType bsd', () => {
      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: BSD_FLAVOR.regionalizedFlavorId,
      });

      const freebsd = result.images.find((img) => img.value === 'FreeBSD');
      expect(freebsd?.osType).toBe('bsd');
      expect(freebsd?.available).toBe(true);
    });

    it('returns linux variants alongside bsd with their correct osTypes', () => {
      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: BSD_FLAVOR.regionalizedFlavorId,
      });

      const ubuntu = result.images.find((img) => img.value === 'Ubuntu');
      const freebsd = result.images.find((img) => img.value === 'FreeBSD');

      expect(ubuntu?.osType).toBe('linux');
      expect(freebsd?.osType).toBe('bsd');
    });

    it('returns correct regionalized image ID for FreeBSD', () => {
      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: BSD_FLAVOR.regionalizedFlavorId,
        distributionImageVariantId: 'FreeBSD',
      });

      const availableVersionValues = result.versions
        .filter((v) => !v.disabled)
        .map((v) => v.value);
      expect(availableVersionValues).toContain('freebsd-14-uuid');
    });
  });

  describe('with windows image type', () => {
    it('returns windows variants for a flavor that accepts windows', () => {
      const catalog = createCatalog({ flavors: [BEST_SELLERS_FLAVOR] });

      catalog.entities.flavorPrices.byId.set(
        `${BEST_SELLERS_FLAVOR.regionalizedFlavorId}_windows_price`,
        {
          id: `${BEST_SELLERS_FLAVOR.regionalizedFlavorId}_windows_price`,
          prices: [
            {
              type: 'hour' as const,
              includeVat: false,
              price: {
                currencyCode: 'EUR',
                value: 0.05,
                priceInUcents: 5000000,
                text: '0.05 €',
              },
              monthlyEquivalent: null,
            },
            {
              type: 'licence' as const,
              includeVat: false,
              price: {
                currencyCode: 'EUR',
                value: 5,
                priceInUcents: 500000000,
                text: '5 €',
              },
              monthlyEquivalent: null,
            },
          ],
        },
      );

      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        selectedImageType: 'windows',
        regionalizedFlavorId: BEST_SELLERS_FLAVOR.regionalizedFlavorId,
      });

      expect(result.images.length).toBeGreaterThan(0);
      result.images.forEach((img) => {
        expect(img.osType).toBe('windows');
      });
    });

    it('returns no windows variants for a metal flavor', () => {
      const catalog = createCatalog({ flavors: [METAL_FLAVOR] });

      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        selectedImageType: 'windows',
        regionalizedFlavorId: METAL_FLAVOR.regionalizedFlavorId,
      });

      expect(result.images).toStrictEqual([]);
    });
  });

  describe('edge cases', () => {
    it('returns empty result when catalog is undefined', () => {
      const result = selectImagesFromCatalog(undefined, {
        ...baseArgs,
        regionalizedFlavorId: 'any',
      });

      expect(result.images).toStrictEqual([]);
      expect(result.versions).toStrictEqual([]);
    });

    it('returns empty result when microRegion is null', () => {
      const catalog = createCatalog({ flavors: [BEST_SELLERS_FLAVOR] });

      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        microRegion: null,
        regionalizedFlavorId: BEST_SELLERS_FLAVOR.regionalizedFlavorId,
      });

      expect(result.images).toStrictEqual([]);
    });

    it('returns empty result when regionalizedFlavorId is null', () => {
      const catalog = createCatalog({ flavors: [BEST_SELLERS_FLAVOR] });

      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: null,
      });

      expect(result.images).toStrictEqual([]);
    });

    it('returns no available variants when flavor has no stock', () => {
      const catalog = createCatalog({
        flavors: [
          {
            regionalizedFlavorId: 'nostock_GRA11',
            flavorId: 'nostock',
            osTypes: ['linux'],
            stockOsTypes: [],
          },
        ],
      });

      const result = selectImagesFromCatalog(catalog, {
        ...baseArgs,
        regionalizedFlavorId: 'nostock_GRA11',
      });

      expect(result.images).toStrictEqual([]);
    });
  });
});
