/* eslint-disable max-lines-per-function */
import { describe, expect, it } from 'vitest';
import {
  emptyResult,
  hasAnyEligibleBackup,
  isBackupEligible,
  selectBackupsEligibilityContext,
  selectEligibleBackups,
  TBackupsEligibilityContext,
} from '../imagesViewModel';
import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';
import { TOsType } from '@/domain/entities/common.types';
import { TBackup } from '@/domain/entities/backup';

const createMinimalCatalog = ({
  regionalizedFlavorId,
  flavorId,
  flavorMinDisk,
  flavorRam,
  flavorAcceptedOsTypes,
  withFlavor = true,
  withRegionalizedFlavor = true,
}: {
  regionalizedFlavorId: string;
  flavorId: string;
  flavorMinDisk: number;
  flavorRam: number;
  flavorAcceptedOsTypes: TOsType[];
  withFlavor?: boolean;
  withRegionalizedFlavor?: boolean;
}): TInstancesCatalog => {
  const regionalizedFlavorsById = new Map();
  if (withRegionalizedFlavor) {
    regionalizedFlavorsById.set(regionalizedFlavorId, {
      id: regionalizedFlavorId,
      regionId: 'GRA1',
      flavorId,
      hasStock: true,
      quota: 1,
      osTypes: flavorAcceptedOsTypes,
      tags: null,
    });
  }

  const flavorsById = new Map();
  if (withFlavor) {
    flavorsById.set(flavorId, {
      name: 'b2-8',
      specifications: {
        cpu: { unit: 'vCore', value: 4 },
        ram: { unit: 'GB', value: flavorRam },
        bandwidth: {
          public: { unit: 'Mbit', value: 1000 },
          private: { unit: 'Mbit', value: 1000 },
        },
        disks: [
          {
            capacity: { unit: 'GB', value: flavorMinDisk },
            number: 1,
          },
        ],
      },
      regionalizedFlavorIds: [regionalizedFlavorId],
    });
  }

  return ({
    entities: {
      flavors: { byId: flavorsById, allIds: [...flavorsById.keys()] },
      regionalizedFlavors: {
        byId: regionalizedFlavorsById,
        allIds: [...regionalizedFlavorsById.keys()],
      },
    },
  } as unknown) as TInstancesCatalog;
};

const createBackup = (overrides: Partial<TBackup>): TBackup =>
  ({
    id: 'instance-backup-1',
    name: 'My instance backup',
    type: 'linux',
    size: 10,
    minDisk: 5,
    minRam: 1,
    region: 'GRA1',
    creationDate: new Date(0).toISOString(),
    ...overrides,
  } as TBackup);

describe('imagesViewModel backups selectors', () => {
  describe('selectBackupsEligibilityContext', () => {
    it('returns null when catalog is undefined', () => {
      expect(selectBackupsEligibilityContext('rf1')(undefined)).toBeNull();
    });

    it('returns null when regionalizedFlavorId is null', () => {
      const catalog = createMinimalCatalog({
        regionalizedFlavorId: 'rf1',
        flavorId: 'fl1',
        flavorMinDisk: 50,
        flavorRam: 8,
        flavorAcceptedOsTypes: ['linux'],
      });
      expect(selectBackupsEligibilityContext(null)(catalog)).toBeNull();
    });

    it('returns null when regionalized flavor is not found', () => {
      const catalog = createMinimalCatalog({
        regionalizedFlavorId: 'rf1',
        flavorId: 'fl1',
        flavorMinDisk: 50,
        flavorRam: 8,
        flavorAcceptedOsTypes: ['linux'],
        withRegionalizedFlavor: false,
      });
      expect(selectBackupsEligibilityContext('rf1')(catalog)).toBeNull();
    });

    it('returns null when flavor is not found', () => {
      const catalog = createMinimalCatalog({
        regionalizedFlavorId: 'rf1',
        flavorId: 'fl1',
        flavorMinDisk: 50,
        flavorRam: 8,
        flavorAcceptedOsTypes: ['linux'],
        withFlavor: false,
      });
      expect(selectBackupsEligibilityContext('rf1')(catalog)).toBeNull();
    });

    it('returns expected eligibility context', () => {
      const catalog = createMinimalCatalog({
        regionalizedFlavorId: 'rf1',
        flavorId: 'fl1',
        flavorMinDisk: 50,
        flavorRam: 8,
        flavorAcceptedOsTypes: ['linux', 'windows'],
      });

      expect(selectBackupsEligibilityContext('rf1')(catalog)).toStrictEqual({
        flavorMinDisk: 50,
        flavorRam: 8,
        flavorAcceptedOsTypes: ['linux', 'windows'],
      });
    });
  });

  describe('isBackupEligible', () => {
    const ctx: TBackupsEligibilityContext = {
      flavorMinDisk: 50,
      flavorRam: 8,
      flavorAcceptedOsTypes: ['linux'],
    };

    it('returns true when all rules match', () => {
      expect(
        isBackupEligible(
          createBackup({ minDisk: 10, minRam: 2, type: 'linux' }),
          ctx,
        ),
      ).toBe(true);
    });

    it('returns false when storage is insufficient', () => {
      expect(
        isBackupEligible(
          createBackup({ minDisk: 60, minRam: 2, type: 'linux' }),
          ctx,
        ),
      ).toBe(false);
    });

    it('returns false when ram is insufficient', () => {
      expect(
        isBackupEligible(
          createBackup({ minDisk: 10, minRam: 16, type: 'linux' }),
          ctx,
        ),
      ).toBe(false);
    });

    it('returns false when osType is not accepted', () => {
      expect(
        isBackupEligible(
          createBackup({ minDisk: 10, minRam: 2, type: 'windows' }),
          ctx,
        ),
      ).toBe(false);
    });
  });

  describe('hasAnyEligibleBackup', () => {
    const ctx: TBackupsEligibilityContext = {
      flavorMinDisk: 50,
      flavorRam: 8,
      flavorAcceptedOsTypes: ['linux'],
    };

    it('returns false when context is null', () => {
      expect(hasAnyEligibleBackup(null)([createBackup({})])).toBe(false);
    });

    it('returns false when backups is undefined or empty', () => {
      expect(hasAnyEligibleBackup(ctx)(undefined)).toBe(false);
      expect(hasAnyEligibleBackup(ctx)([])).toBe(false);
    });

    it('returns true when at least one backup is eligible', () => {
      const eligible = createBackup({ id: 'b1', minDisk: 10, minRam: 2 });
      const notEligible = createBackup({
        id: 'b2',
        minDisk: 100,
        minRam: 2,
      });

      expect(hasAnyEligibleBackup(ctx)([notEligible, eligible])).toBe(true);
    });
  });

  describe('selectEligibleBackups', () => {
    const ctx: TBackupsEligibilityContext = {
      flavorMinDisk: 50,
      flavorRam: 8,
      flavorAcceptedOsTypes: ['linux'],
    };

    it('returns emptyResult when context is null', () => {
      expect(selectEligibleBackups(null)([createBackup({})])).toStrictEqual(
        emptyResult,
      );
    });

    it('returns emptyResult when backups is undefined or empty', () => {
      expect(selectEligibleBackups(ctx)(undefined)).toStrictEqual(emptyResult);
      expect(selectEligibleBackups(ctx)([])).toStrictEqual(emptyResult);
    });

    it('returns images with available computed and preselects first available', () => {
      const firstNotEligible = createBackup({
        id: 'b1',
        minDisk: 100,
        minRam: 2,
        name: 'Too big',
      });
      const firstEligible = createBackup({
        id: 'b2',
        minDisk: 10,
        minRam: 2,
        name: 'OK',
      });

      const result = selectEligibleBackups(ctx)([
        firstNotEligible,
        firstEligible,
      ]);

      expect(result.versions).toStrictEqual([]);
      expect(result.images).toStrictEqual([
        {
          label: 'Too big',
          value: 'b1',
          osType: 'linux',
          available: false,
        },
        {
          label: 'OK',
          value: 'b2',
          osType: 'linux',
          available: true,
        },
      ]);
      expect(result.preselected.preselectedFirstAvailableVariantId).toBe('b2');
      expect(result.preselected.preselectedFirstAvailableVersion).toBeNull();
    });
  });
});
