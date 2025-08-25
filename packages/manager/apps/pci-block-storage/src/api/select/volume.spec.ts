import { describe, it, vi } from 'vitest';
import { TFunction } from 'i18next';
import {
  EncryptionType,
  getEncryption,
  mapVolumeEncryption,
  paginateResults,
  sortResults,
} from './volume';
import { TVolume } from '@/api/hooks/useVolume';
import { TVolumeCatalog } from '@/api/data/catalog';
import { TAPIVolume } from '@/api/data/volume';

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

describe('paginateResults and sortResults', () => {
  it('should paginate and sort results', () => {
    const mockVolumes = [
      { id: '1', name: 'Volume 1' },
      { id: '2', name: 'Volume 2' },
    ];
    const pagination = { pageIndex: 0, pageSize: 10 };
    const sorting = { id: 'name', desc: false };

    const paginatedResults = paginateResults(mockVolumes, pagination);
    const sortedResults = sortResults(
      paginatedResults.rows as TVolume[],
      sorting,
    );

    expect(paginatedResults).toEqual({
      rows: mockVolumes,
      pageCount: 1,
      totalRows: 2,
    });
    expect(sortedResults).toEqual(mockVolumes);
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
