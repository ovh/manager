import { describe, it } from 'vitest';
import { TFunction } from 'i18next';
import { TVolumeAddon, TVolumeCatalog } from '@/api/data/catalog';
import { TRegion } from '@/api/data/regions';
import {
  getPricingSpecsFromModelPricings,
  is3az,
  mapRetypingVolumeCatalog,
  mapVolumeCatalog,
  sortByPreselectedModel,
} from '@/api/select/catalog';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { TVolumeRetypeModel } from '../hooks/useCatalogWithPreselection';

const region = {
  name: 'region name',
  type: 'region',
  availabilityZones: ['FR'],
  isInMaintenance: false,
  isActivated: true,
  country: 'FR',
  datacenter: 'datacenter',
} as TRegion;

const region3AZ = {
  name: 'region3AZ',
  type: 'region-3-az',
  availabilityZones: ['FR'],
  isInMaintenance: false,
  isActivated: true,
  country: 'FR',
  datacenter: 'datacenter',
} as TRegion;

const createClassicModel = (specName = 'classic spec name') =>
  ({
    name: 'classic',
    pricings: [
      {
        price: 20,
        regions: [region.name],
        specs: {
          name: specName,
          volume: {
            iops: { level: 10 },
            capacity: { max: 11 },
          },
          bandwidth: { level: 12, max: 13, guaranteed: true },
        },
      },
    ],
  } as TVolumeAddon);

const model3AZ = {
  name: '3AZ',
  pricings: [
    {
      price: 200,
      regions: [region3AZ.name],
      specs: {
        volume: { iops: { level: 100 }, capacity: { max: 110 } },
      },
    },
  ],
} as TVolumeAddon;

describe('select catalog', () => {
  describe('mapVolumeCatalog', () => {
    const catalogPriceFormatter = (price: number) => `price: ${price}`;
    const translator = ((keyValue: string) => keyValue) as TFunction;

    const catalog = {
      regions: [region, region3AZ],
      models: [createClassicModel(), model3AZ],
    } as TVolumeCatalog;

    it('should filter out elements that dont have pricing in the input region', () => {
      const result = mapVolumeCatalog(
        region.name,
        catalogPriceFormatter,
        translator,
      )(catalog);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expect.objectContaining(createClassicModel()));
    });

    it('should add hourly price', () => {
      const result = mapVolumeCatalog(
        region.name,
        catalogPriceFormatter,
        translator,
      )(catalog);

      expect(result[0]).toEqual(
        expect.objectContaining({
          hourlyPrice: {
            value: `price: ${createClassicModel().pricings[0].price}`,
            isLeastPrice: false,
            unit:
              'add:pci_projects_project_storages_blocks_add_type_addon_price',
          },
        }),
      );
    });

    it('should add monthly price', () => {
      const result = mapVolumeCatalog(
        region.name,
        catalogPriceFormatter,
        translator,
      )(catalog);

      expect(result[0]).toEqual(
        expect.objectContaining({
          monthlyPrice: {
            value: `price: ${createClassicModel().pricings[0].price * 730}`,
            isLeastPrice: false,
            unit: 'add:pci_projects_project_storages_blocks_add_type_price',
          },
        }),
      );
    });

    it('should add bandwidth', () => {
      const result = mapVolumeCatalog(
        region.name,
        catalogPriceFormatter,
        translator,
      )(catalog);

      expect(result[0]).toEqual(
        expect.objectContaining({
          bandwidth: `${
            createClassicModel().pricings[0].specs.bandwidth.level
          } @ovh-ux/manager-common-translations/bytes:unit_size_MB/s common:pci_projects_project_storages_blocks_guaranteed`,
        }),
      );
    });

    it('should add displayName and technical name', () => {
      const result = mapVolumeCatalog(
        region.name,
        catalogPriceFormatter,
        translator,
      )(catalog);

      expect(result[0]).toEqual(
        expect.objectContaining({
          displayName: createClassicModel().name,
          technicalName: createClassicModel().pricings[0].specs.name,
        }),
      );
    });

    it('should add shouldUseMultiAttachFileSystem to true if model is multiattach', () => {
      const catalogWithMultiAttach = {
        regions: [region],
        models: [{ ...createClassicModel(), name: 'classic-multiattach' }],
      } as TVolumeCatalog;

      const result = mapVolumeCatalog(
        region.name,
        catalogPriceFormatter,
        translator,
      )(catalogWithMultiAttach);

      expect(result[0]).toEqual(
        expect.objectContaining({
          shouldUseMultiAttachFileSystem: true,
        }),
      );
    });
  });

  describe('getPricingSpecsFromModelPricings', () => {
    const catalogPriceFormatter = (price: number) => `price: ${price}`;
    const translator = ((keyValue: string) => keyValue) as TFunction;

    const gen2Pricings = ([
      {
        price: 10,
        regions: [region.name],
        areIOPSDynamic: true,
        isBandwidthDynamic: true,
        specs: {
          name: 'high-speed-gen2-spec',
          volume: {
            iops: {
              level: 100,
              max: 50000,
              guaranteed: false,
              min: 3000,
            },
            capacity: { max: 4000 },
          },
          bandwidth: {
            level: 1,
            max: 1000,
            guaranteed: false,
            min: 50,
          },
        },
      },
    ] as unknown) as TVolumeAddon['pricings'];

    it('exposes iops and bandwidth base range strings when min is set', () => {
      const result = getPricingSpecsFromModelPricings(
        gen2Pricings,
        catalogPriceFormatter,
        translator,
        10,
      );

      expect(result.iopsBaseRange).toBe(
        'common:pci_projects_project_storages_blocks_iops_base_range',
      );
      expect(result.bandwidthBaseRange).toBe(
        'common:pci_projects_project_storages_blocks_bandwidth_base_range',
      );
    });

    it('does not expose base range strings when min is missing', () => {
      const result = getPricingSpecsFromModelPricings(
        createClassicModel().pricings,
        catalogPriceFormatter,
        translator,
        10,
      );

      expect(result.iopsBaseRange).toBeUndefined();
      expect(result.bandwidthBaseRange).toBeUndefined();
    });

    describe('conditional floor', () => {
      it('floors iops at min when capacity * level falls below min', () => {
        const result = getPricingSpecsFromModelPricings(
          gen2Pricings,
          catalogPriceFormatter,
          translator,
          10, // 10 * 100 = 1000 < min(3000) → floored
        );

        expect(result.iops).toContain('3000 IOPS');
        expect(result.iops).not.toContain('1000 IOPS');
      });

      it('keeps the raw iops value when capacity * level exceeds min', () => {
        const result = getPricingSpecsFromModelPricings(
          gen2Pricings,
          catalogPriceFormatter,
          translator,
          100, // 100 * 100 = 10000 > min(3000) → kept
        );

        expect(result.iops).toContain('10000 IOPS');
      });

      it('does NOT floor the per-GB iops display when capacity is undefined', () => {
        const result = getPricingSpecsFromModelPricings(
          gen2Pricings,
          catalogPriceFormatter,
          translator,
          // capacity omitted on purpose
        );

        // Should be "100 IOPS/<gb-unit>, <up_to> 50000 IOPS" — never the floor.
        expect(result.iops).toContain('100 IOPS');
        expect(result.iops).not.toContain('3000 IOPS');
      });

      it('floors bandwidth at min when capacity * level falls below min', () => {
        const result = getPricingSpecsFromModelPricings(
          gen2Pricings,
          catalogPriceFormatter,
          translator,
          10, // 10 * 1 = 10 < min(50) → floored
        );

        expect(result.bandwidth).toContain('50');
      });

      it('keeps the raw bandwidth value when capacity * level exceeds min', () => {
        const result = getPricingSpecsFromModelPricings(
          gen2Pricings,
          catalogPriceFormatter,
          translator,
          200, // 200 * 1 = 200 > min(50) → kept
        );

        expect(result.bandwidth).toContain('200');
      });

      it('does NOT floor the per-GB bandwidth display when capacity is undefined', () => {
        const result = getPricingSpecsFromModelPricings(
          gen2Pricings,
          catalogPriceFormatter,
          translator,
        );

        // Per-GB level is 1 MB/s/GB; floor (50) must NOT replace it.
        expect(result.bandwidth).toContain('1');
        expect(result.bandwidth).not.toContain('50 ');
      });
    });
  });

  describe('mapRetypingVolumeCatalog', () => {
    const catalogPriceFormatter = (price: number) => `price: ${price}`;
    const translator = ((keyValue: string) => keyValue) as TFunction;

    const catalog = {
      regions: [region, region3AZ],
      models: [createClassicModel(), model3AZ],
    } as TVolumeCatalog;

    it('should filter out element that dont have pricing in the input region', () => {
      const result = mapRetypingVolumeCatalog(
        region.name,
        catalogPriceFormatter,
        translator,
        null,
      )(catalog);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expect.objectContaining(createClassicModel()));
    });

    it('should filter out elements that are in 3az region and multi attach', () => {
      const classic3azModel = { ...model3AZ, name: 'classic-multiattach' };

      const result = mapRetypingVolumeCatalog(
        region3AZ.name,
        catalogPriceFormatter,
        translator,
        null,
      )({
        regions: [region3AZ],
        models: [
          model3AZ,
          classic3azModel,
          { ...model3AZ, name: 'high-speed-gen2' },
        ],
      } as TVolumeCatalog);

      expect(result).toHaveLength(2);
      expect(result).not.toContain(classic3azModel);
    });

    it('should add hourly price', () => {
      const result = mapRetypingVolumeCatalog(
        region.name,
        catalogPriceFormatter,
        translator,
        null,
      )(catalog);

      expect(result[0]).toEqual(
        expect.objectContaining({
          hourlyPrice: {
            value: `price: ${createClassicModel().pricings[0].price}`,
            isLeastPrice: false,
            unit:
              'add:pci_projects_project_storages_blocks_add_type_addon_price',
          },
        }),
      );
    });

    it('should add monthly price', () => {
      const result = mapRetypingVolumeCatalog(
        region.name,
        catalogPriceFormatter,
        translator,
        null,
      )(catalog);

      expect(result[0]).toEqual(
        expect.objectContaining({
          monthlyPrice: {
            value: `price: ${createClassicModel().pricings[0].price * 730}`,
            isLeastPrice: false,
            unit: 'add:pci_projects_project_storages_blocks_add_type_price',
          },
        }),
      );
    });

    it('should add bandwidth', () => {
      const result = mapRetypingVolumeCatalog(
        region.name,
        catalogPriceFormatter,
        translator,
        null,
      )(catalog);

      expect(result[0]).toEqual(
        expect.objectContaining({
          bandwidth: `${
            createClassicModel().pricings[0].specs.bandwidth.level
          } @ovh-ux/manager-common-translations/bytes:unit_size_MB/s common:pci_projects_project_storages_blocks_guaranteed`,
        }),
      );
    });

    it('should add displayName and technical name', () => {
      const result = mapRetypingVolumeCatalog(
        region.name,
        catalogPriceFormatter,
        translator,
        null,
      )(catalog);

      expect(result[0]).toEqual(
        expect.objectContaining({
          displayName: createClassicModel().name,
          technicalName: createClassicModel().pricings[0].specs.name,
        }),
      );
    });

    it('should add shouldUseMultiAttachFileSystem to true if model is multiattach', () => {
      const catalogWithMultiAttach = {
        regions: [region],
        models: [{ ...createClassicModel(), name: 'classic-multiattach' }],
      } as TVolumeCatalog;

      const result = mapRetypingVolumeCatalog(
        region.name,
        catalogPriceFormatter,
        translator,
        null,
      )(catalogWithMultiAttach);

      expect(result[0]).toEqual(
        expect.objectContaining({
          shouldUseMultiAttachFileSystem: true,
        }),
      );
    });

    it('should add preselected to model matching the type', () => {
      const type = 'target type';
      const preselectedModel = createClassicModel(type);
      const notPreselectedModel = createClassicModel('other');

      const catalogWithMultiAttach = {
        regions: [region],
        models: [preselectedModel, notPreselectedModel],
      } as TVolumeCatalog;

      const result = mapRetypingVolumeCatalog(
        region.name,
        catalogPriceFormatter,
        translator,
        type,
      )(catalogWithMultiAttach);

      expect(result).toHaveLength(2);
      expect(result[0].isPreselected).toBe(true);
      expect(result[1].isPreselected).toBe(false);
    });
  });

  describe('is3az', () => {
    it('should return false if the catalog region mathing the input region have a type different that "region-3-az"', () => {
      const matchingRegionName = 'matching region';
      const mockRegions = [
        { name: matchingRegionName, type: 'region' },
        { name: 'otherRegion', type: 'region-3-az' },
      ] as TRegion[];

      const result = is3az(mockRegions, matchingRegionName);

      expect(result).toBe(false);
    });

    it('should return true if the catalog region mathing the input region have a type equal to "region-3-az"', () => {
      const matchingRegionName = 'matching region';
      const mockRegions = [
        { name: matchingRegionName, type: 'region-3-az' },
        { name: 'otherRegion', type: 'region' },
      ] as TRegion[];

      const result = is3az(mockRegions, matchingRegionName);

      expect(result).toBe(true);
    });
  });

  describe('sortByPreselectedModel', () => {
    describe('with TVolumeModel', () => {
      const model0 = { name: 'model_0' } as TVolumeModel;
      const model1 = { name: 'model_1' } as TVolumeModel;
      const model2 = { name: 'model_2' } as TVolumeModel;
      const model3 = { name: 'model_3' } as TVolumeModel;

      it('should not change the order', () => {
        const volumeModels = [model0, model3, model2, model1];

        const result = sortByPreselectedModel(volumeModels);

        expect(result).toEqual(volumeModels);
      });
    });

    describe('with TVolumeRetypeModel', () => {
      const model0 = { name: 'model_0' } as TVolumeRetypeModel;
      const model1 = { name: 'model_1' } as TVolumeRetypeModel;
      const model2 = { name: 'model_2' } as TVolumeRetypeModel;
      const model3 = { name: 'model_3' } as TVolumeRetypeModel;

      const preselectedModel = {
        name: 'model_preselected',
        isPreselected: true,
      } as TVolumeRetypeModel;

      it.each`
        description                | volumeModels                                          | expectedResult
        ${'no preselected'}        | ${[model0, model3, model2, model1]}                   | ${[model0, model3, model2, model1]}
        ${'preselected in first'}  | ${[preselectedModel, model0, model3, model2, model1]} | ${[preselectedModel, model0, model3, model2, model1]}
        ${'preselected in second'} | ${[model0, preselectedModel, model3, model2, model1]} | ${[preselectedModel, model0, model3, model2, model1]}
        ${'preselected in third'}  | ${[model0, model3, preselectedModel, model2, model1]} | ${[preselectedModel, model0, model3, model2, model1]}
        ${'preselected in fourth'} | ${[model0, model3, model2, preselectedModel, model1]} | ${[preselectedModel, model0, model3, model2, model1]}
        ${'preselected in fifth'}  | ${[model0, model3, model2, model1, preselectedModel]} | ${[preselectedModel, model0, model3, model2, model1]}
      `(
        'should put the preselected model first and not change the order of the other models when $description',
        ({ volumeModels, expectedResult }) => {
          const result = sortByPreselectedModel(volumeModels);

          expect(result).toEqual(expectedResult);
        },
      );
    });
  });
});
