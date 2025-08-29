import { describe, it, vi } from 'vitest';
import { TFunction } from 'i18next';
import {
  EncryptionType,
  getEncryption,
  mapVolumeEncryption,
  mapVolumeType,
  paginateResults,
  sortResults,
} from './volume';
import { TVolume } from '@/api/hooks/useVolume';
import { BlockStorageListColumn } from '@/hooks/useDatagridColumn';
import { TVolumeCatalog } from '@/api/data/catalog';
import { TAPIVolume } from '@/api/data/volume';
import { is3az } from '@/api/select/catalog';
import { TRegion } from '@/api/data/regions';

vi.mock('@/api/select/catalog', () => ({
  getPricingSpecsFromModelPricings: vi.fn(),
  getVolumeModelPricings: vi.fn(),
  is3az: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  getMacroRegion: vi.fn(),
}));

const region = 'FR';
const encryptedSpec = {
  name: 'spec encrypted',
  encrypted: true,
};

const nonEncryptedSpec = {
  name: 'spec not encrypted',
  encrypted: false,
};

const specWithoutEncryptionSpecification = {
  name: 'spec without encrypted',
  encrypted: undefined,
};

const catalog = {
  models: [
    {
      pricings: [
        {
          specs: encryptedSpec,
          regions: [region],
        },
        {
          specs: nonEncryptedSpec,
          regions: [region],
        },
        {
          specs: specWithoutEncryptionSpecification,
          regions: [region],
        },
      ],
    },
  ],
} as TVolumeCatalog;

describe('volume', () => {
  describe('sortResults', () => {
    it.each(['ascending', 'descending'])(
      'should sort results by name %s',
      (direction: string) => {
        const isDescending = direction === 'descending';
        const rawVolumes = [
          { id: '1', name: 'Aaa' },
          { id: '2', name: 'zzz' },
          { id: '3', name: 'Bbb' },
          { id: '4', name: 'bba' },
        ] as TVolume[];
        const sortedVolumesDescending = [
          { id: '2', name: 'zzz' },
          { id: '3', name: 'Bbb' },
          { id: '4', name: 'bba' },
          { id: '1', name: 'Aaa' },
        ] as TVolume[];

        const sorting = {
          id: BlockStorageListColumn.NAME,
          desc: isDescending,
        };

        const sortedResults = sortResults(rawVolumes, sorting);

        expect(sortedResults).toEqual(
          isDescending
            ? sortedVolumesDescending
            : sortedVolumesDescending.reverse(),
        );
      },
    );

    it.each(['ascending', 'descending'])(
      'should sort results by id %s',
      (direction: string) => {
        const isDescending = direction === 'descending';
        const rawVolumes = [
          { id: '1', name: 'Aaa' },
          { id: '4', name: 'bba' },
          { id: '3', name: 'Bbb' },
          { id: '2', name: 'zzz' },
        ] as TVolume[];
        const sortedVolumesDescending = [
          { id: '4', name: 'bba' },
          { id: '3', name: 'Bbb' },
          { id: '2', name: 'zzz' },
          { id: '1', name: 'Aaa' },
        ] as TVolume[];

        const sorting = {
          id: BlockStorageListColumn.ID,
          desc: isDescending,
        };

        const sortedResults = sortResults(rawVolumes, sorting);

        expect(sortedResults).toEqual(
          isDescending
            ? sortedVolumesDescending
            : sortedVolumesDescending.reverse(),
        );
      },
    );

    it.each(['ascending', 'descending'])(
      'should sort results by regionName %s',
      (direction: string) => {
        const isDescending = direction === 'descending';
        const rawVolumes = [
          { id: '1', regionName: 'Aaa' },
          { id: '2', regionName: 'zzz' },
          { id: '3', regionName: 'Bbb' },
          { id: '4', regionName: 'bba' },
        ] as TVolume[];
        const sortedVolumesDescending = [
          { id: '2', regionName: 'zzz' },
          { id: '3', regionName: 'Bbb' },
          { id: '4', regionName: 'bba' },
          { id: '1', regionName: 'Aaa' },
        ] as TVolume[];

        const sorting = {
          id: BlockStorageListColumn.REGION,
          desc: isDescending,
        };

        const sortedResults = sortResults(rawVolumes, sorting);

        expect(sortedResults).toEqual(
          isDescending
            ? sortedVolumesDescending
            : sortedVolumesDescending.reverse(),
        );
      },
    );

    it.each(['ascending', 'descending'])(
      'should sort results by type %s',
      (direction: string) => {
        const isDescending = direction === 'descending';
        const rawVolumes = [
          { id: '1', type: 'classic' },
          { id: '2', type: 'classic-luks' },
          { id: '3', type: 'classic-multiattach' },
          { id: '4', type: 'classic-luks' },
        ] as TVolume[];
        const sortedVolumesDescending = [
          { id: '3', type: 'classic-multiattach' },
          { id: '2', type: 'classic-luks' },
          { id: '4', type: 'classic-luks' },
          { id: '1', type: 'classic' },
        ] as TVolume[];

        const sorting = {
          id: BlockStorageListColumn.TYPE,
          desc: isDescending,
        };

        const sortedResults = sortResults(rawVolumes, sorting);

        expect(sortedResults).toEqual(
          isDescending
            ? sortedVolumesDescending
            : sortedVolumesDescending.reverse(),
        );
      },
    );

    it.each(['ascending', 'descending'])(
      'should sort results by size %s',
      (direction: string) => {
        const isDescending = direction === 'descending';
        const rawVolumes = [
          { id: '1', size: 10 },
          { id: '2', size: 100 },
          { id: '3', size: 50 },
          { id: '4', size: 10 },
        ] as TVolume[];
        const sortedVolumesDescending = [
          { id: '2', size: 100 },
          { id: '3', size: 50 },
          { id: '1', size: 10 },
          { id: '4', size: 10 },
        ] as TVolume[];

        const sorting = {
          id: BlockStorageListColumn.SIZE,
          desc: isDescending,
        };

        const sortedResults = sortResults(rawVolumes, sorting);

        expect(sortedResults).toEqual(
          isDescending
            ? sortedVolumesDescending
            : sortedVolumesDescending.reverse(),
        );
      },
    );

    it.each(['ascending', 'descending'])(
      'should sort results by attachedTo %s',
      (direction: string) => {
        const isDescending = direction === 'descending';
        const rawVolumes = [
          { id: '1', attachedTo: ['Aaa'] },
          { id: '2', attachedTo: ['zzz'] },
          { id: '3', attachedTo: ['Bbb'] },
          { id: '4', attachedTo: ['bba'] },
          { id: '5', attachedTo: [] },
        ] as TVolume[];
        const sortedVolumesDescending = [
          { id: '2', attachedTo: ['zzz'] },
          { id: '3', attachedTo: ['Bbb'] },
          { id: '4', attachedTo: ['bba'] },
          { id: '1', attachedTo: ['Aaa'] },
          { id: '5', attachedTo: [] },
        ] as TVolume[];

        const sorting = {
          id: BlockStorageListColumn.ATTACHED,
          desc: isDescending,
        };

        const sortedResults = sortResults(rawVolumes, sorting);

        expect(sortedResults).toEqual(
          isDescending
            ? sortedVolumesDescending
            : sortedVolumesDescending.reverse(),
        );
      },
    );

    it.each(['ascending', 'descending'])(
      'should sort results by encryption status %s',
      (direction: string) => {
        const isDescending = direction === 'descending';
        const rawVolumes = [
          { id: '1', encryptionStatus: 'None' },
          { id: '2', encryptionStatus: 'Active' },
          { id: '3', encryptionStatus: 'Active' },
          { id: '4', encryptionStatus: 'None' },
        ] as TVolume[];
        const sortedVolumesDescending = [
          { id: '1', encryptionStatus: 'None' },
          { id: '4', encryptionStatus: 'None' },
          { id: '2', encryptionStatus: 'Active' },
          { id: '3', encryptionStatus: 'Active' },
        ] as TVolume[];

        const sorting = {
          id: BlockStorageListColumn.ENCRYPTION,
          desc: isDescending,
        };

        const sortedResults = sortResults(rawVolumes, sorting);

        expect(sortedResults).toEqual(
          isDescending
            ? sortedVolumesDescending
            : sortedVolumesDescending.reverse(),
        );
      },
    );

    it.each(['ascending', 'descending'])(
      'should sort results by status group %s',
      (direction: string) => {
        const isDescending = direction === 'descending';
        const rawVolumes = [
          { id: '1', statusGroup: 'ACTIVE' },
          { id: '2', statusGroup: 'PENDING' },
          { id: '3', statusGroup: 'ACTIVE' },
          { id: '4', statusGroup: 'ERROR' },
        ] as TVolume[];
        const sortedVolumesDescending = [
          { id: '2', statusGroup: 'PENDING' },
          { id: '4', statusGroup: 'ERROR' },
          { id: '1', statusGroup: 'ACTIVE' },
          { id: '3', statusGroup: 'ACTIVE' },
        ] as TVolume[];

        const sorting = {
          id: BlockStorageListColumn.STATUS,
          desc: isDescending,
        };

        const sortedResults = sortResults(rawVolumes, sorting);

        expect(sortedResults).toEqual(
          isDescending
            ? sortedVolumesDescending
            : sortedVolumesDescending.reverse(),
        );
      },
    );

    it.each(['ascending', 'descending'])(
      'should not sort if sorting by actions %s',
      (direction: string) => {
        const isDescending = direction === 'descending';
        const rawVolumes = [
          { id: '1', statusGroup: 'ACTIVE' },
          { id: '2', statusGroup: 'PENDING' },
          { id: '3', statusGroup: 'ACTIVE' },
          { id: '4', statusGroup: 'ERROR' },
        ] as TVolume[];

        const sorting = {
          id: BlockStorageListColumn.ACTIONS,
          desc: isDescending,
        };

        const sortedResults = sortResults(rawVolumes, sorting);

        expect(sortedResults).toEqual(rawVolumes);
      },
    );

    it('should return input given no sorting', () => {
      const rawVolumes = [
        { id: '1', name: 'Aaa' },
        { id: '2', name: 'zzz' },
        { id: '3', name: 'Bbb' },
        { id: '4', name: 'bba' },
      ] as TVolume[];

      const sortedResults = sortResults(rawVolumes, undefined);

      expect(sortedResults).toEqual(rawVolumes);
    });

    it('should return input given empty array', () => {
      const rawVolumes = [] as TVolume[];
      const sorting = {
        id: BlockStorageListColumn.STATUS,
        desc: true,
      };

      const sortedResults = sortResults(rawVolumes, sorting);

      expect(sortedResults).toEqual([]);
    });
  });

  describe('paginateResults', () => {
    it('should paginate items', () => {
      const rawItems = ['1', '2', '3', '4', '5'];

      const paginatedItems = paginateResults(rawItems, {
        pageIndex: 1,
        pageSize: 2,
      });

      expect(paginatedItems).toEqual({
        rows: ['3', '4'],
        pageCount: 3,
        totalRows: 5,
      });
    });
  });

  describe('getEncryption', () => {
    it('should return encrypted true and OMK encryption if corresponding specs is encrypted', () => {
      const volume = {
        type: encryptedSpec.name,
        region,
      } as TAPIVolume;

      const result = getEncryption(catalog)(volume);

      expect(result).toEqual({
        encrypted: true,
        encryptionType: EncryptionType.OMK,
      });
    });

    it('should return encrypted false and encryptionType null if corresponding specs is encrypted', () => {
      const volume = {
        type: nonEncryptedSpec.name,
        region,
      } as TAPIVolume;

      const result = getEncryption(catalog)(volume);

      expect(result).toEqual({
        encrypted: false,
        encryptionType: null,
      });
    });

    it('should return encrypted and encryptionType null if corresponding specs does not have encrypted value', () => {
      const volume = {
        type: specWithoutEncryptionSpecification.name,
        region,
      } as TAPIVolume;

      const result = getEncryption(catalog)(volume);

      expect(result).toEqual({
        encrypted: null,
        encryptionType: null,
      });
    });
  });

  describe('mapVolumeEncryption', () => {
    const mockTranslator = (vi.fn() as unknown) as TFunction<['common']>;
    vi.mocked(mockTranslator).mockReturnValue('translation');

    it('should add encrypted true, OMK encryption and active status if corresponding specs is encrypted', () => {
      const volume = {
        type: encryptedSpec.name,
        region,
      } as TAPIVolume;
      const result = mapVolumeEncryption(mockTranslator, catalog)(volume);

      expect(result).toEqual(
        expect.objectContaining({
          encrypted: true,
          encryptionType: EncryptionType.OMK,
          encryptionStatus: 'translation',
        }),
      );
      expect(mockTranslator).toHaveBeenCalledWith(
        'common:pci_projects_project_storages_blocks_status',
        {
          context: 'ACTIVE',
          defaultValue: 'ACTIVE',
        },
      );
    });

    it('should add encrypted false, null encryption and none status if corresponding specs is encrypted', () => {
      const volume = {
        type: nonEncryptedSpec.name,
        region,
      } as TAPIVolume;
      const result = mapVolumeEncryption(mockTranslator, catalog)(volume);

      expect(result).toEqual(
        expect.objectContaining({
          encrypted: false,
          encryptionType: null,
          encryptionStatus: 'translation',
        }),
      );
      expect(mockTranslator).toHaveBeenCalledWith(
        'common:pci_projects_project_storages_blocks_status',
        {
          context: 'NONE',
          defaultValue: 'NONE',
        },
      );
    });

    it('should add encrypted and encryption null and UNKNOWN status if corresponding specs is encrypted', () => {
      const volume = {
        type: specWithoutEncryptionSpecification.name,
        region,
      } as TAPIVolume;
      const result = mapVolumeEncryption(mockTranslator, catalog)(volume);

      expect(result).toEqual(
        expect.objectContaining({
          encrypted: null,
          encryptionType: null,
          encryptionStatus: 'translation',
        }),
      );
      expect(mockTranslator).toHaveBeenCalledWith(
        'common:pci_projects_project_storages_blocks_status',
        {
          context: 'UNKNOWN',
          defaultValue: 'UNKNOWN',
        },
      );
    });
  });

  describe('mapVolumeType', () => {
    it('should add the value of is3az and isClassicMultiattach to true if type is "classic-multiattach"', () => {
      const volume = {
        region: 'region',
        type: 'classic-multiattach',
      } as TAPIVolume;
      const catalogRegion = [{ name: 'toto' }] as TRegion[];
      vi.mocked(is3az).mockReturnValue(false);

      const result = mapVolumeType({
        regions: catalogRegion,
      } as TVolumeCatalog)(volume);

      expect(result).toEqual({
        ...volume,
        is3az: false,
        isClassicMultiAttach: true,
      });
      expect(is3az).toHaveBeenCalledWith(catalogRegion, volume.region);
    });

    it('should add the value of is3az and isClassicMultiattach to false if type is not "classic-multiattach"', () => {
      const volume = { region: 'region', type: 'classic' } as TAPIVolume;
      const catalogRegion = [{ name: 'toto' }] as TRegion[];
      vi.mocked(is3az).mockReturnValue(true);

      const result = mapVolumeType({
        regions: catalogRegion,
      } as TVolumeCatalog)(volume);

      expect(result).toEqual({
        ...volume,
        is3az: true,
        isClassicMultiAttach: false,
      });
      expect(is3az).toHaveBeenCalledWith(catalogRegion, volume.region);
    });
  });
});
