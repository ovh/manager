import { describe, it, expect } from 'vitest';
import {
  TInstancesCatalog,
  TMicroRegion,
  TMacroRegion,
} from '@/domain/entities/instancesCatalog';
import { isAPACRegion } from '../localizationsViewModel';

const createMinimalCatalog = (
  microRegions: Array<{ id: string; macroRegionId: string }>,
  macroRegions: Array<{ id: string; continentIds: string[] }>,
): TInstancesCatalog => {
  const microRegionsById = new Map<string, TMicroRegion>();
  const macroRegionsById = new Map<string, TMacroRegion>();

  microRegions.forEach(({ id, macroRegionId }) => {
    microRegionsById.set(id, {
      name: id,
      availabilityZones: [],
      isActivable: true,
      isActivated: true,
      isInMaintenance: false,
      macroRegionId,
    } as TMicroRegion);
  });

  macroRegions.forEach(({ id, continentIds }) => {
    macroRegionsById.set(id, {
      name: id,
      deploymentMode: 'region',
      continentIds,
      country: null,
      microRegions: microRegions
        .filter((mr) => mr.macroRegionId === id)
        .map((mr) => mr.id),
    } as TMacroRegion);
  });

  return ({
    entities: {
      microRegions: {
        byId: microRegionsById,
        allIds: microRegions.map((mr) => mr.id),
      },
      macroRegions: {
        byId: macroRegionsById,
        allIds: macroRegions.map((mr) => mr.id),
      },
    },
  } as unknown) as TInstancesCatalog;
};

describe('isAPACRegion', () => {
  describe('when catalog or microRegion is null/undefined', () => {
    it.each([
      {
        microRegion: 'SGP1' as string | null,
        catalog: undefined,
        description: 'catalog is undefined',
      },
      {
        microRegion: null,
        catalog: createMinimalCatalog(
          [{ id: 'SGP1', macroRegionId: 'SGP' }],
          [{ id: 'SGP', continentIds: ['asia_oceania'] }],
        ),
        description: 'microRegion is null',
      },
      {
        microRegion: null,
        catalog: undefined,
        description: 'microRegion is null and catalog is undefined',
      },
    ])('should return false when $description', ({ microRegion, catalog }) => {
      expect(isAPACRegion(microRegion)(catalog)).toBe(false);
    });
  });

  describe('when microRegion does not exist in catalog', () => {
    it('should return false when microRegion is not found', () => {
      const catalog = createMinimalCatalog(
        [{ id: 'SGP1', macroRegionId: 'SGP' }],
        [{ id: 'SGP', continentIds: ['asia_oceania'] }],
      );
      expect(isAPACRegion('UNKNOWN_REGION')(catalog)).toBe(false);
    });
  });

  describe('when macroRegion does not exist', () => {
    it('should return false when macroRegion is not found', () => {
      const catalog = createMinimalCatalog(
        [{ id: 'SGP1', macroRegionId: 'UNKNOWN_MACRO' }],
        [{ id: 'SGP', continentIds: ['asia_oceania'] }],
      );
      expect(isAPACRegion('SGP1')(catalog)).toBe(false);
    });
  });

  describe('when region is in APAC zone (asia_oceania)', () => {
    it.each([
      { microRegionId: 'SGP1', macroRegionId: 'SGP' },
      { microRegionId: 'SGP2', macroRegionId: 'SGP' },
      { microRegionId: 'SYD1', macroRegionId: 'SYD' },
      { microRegionId: 'SYD2', macroRegionId: 'SYD' },
    ])(
      'should return true for $microRegionId region',
      ({ microRegionId, macroRegionId }) => {
        const catalog = createMinimalCatalog(
          [{ id: microRegionId, macroRegionId }],
          [{ id: macroRegionId, continentIds: ['asia_oceania'] }],
        );
        expect(isAPACRegion(microRegionId)(catalog)).toBe(true);
      },
    );

    it('should return true when macroRegion has multiple continentIds including asia_oceania', () => {
      const catalog = createMinimalCatalog(
        [{ id: 'SGP1', macroRegionId: 'SGP' }],
        [{ id: 'SGP', continentIds: ['asia_oceania', 'other_continent'] }],
      );
      expect(isAPACRegion('SGP1')(catalog)).toBe(true);
    });
  });

  describe('when region is not in APAC zone', () => {
    it.each([
      {
        microRegionId: 'GRA11',
        macroRegionId: 'GRA',
        continentIds: ['western_europe'],
        description: 'GRA11 region (western_europe)',
      },
      {
        microRegionId: 'BHS5',
        macroRegionId: 'BHS',
        continentIds: ['north_america'],
        description: 'BHS5 region (north_america)',
      },
      {
        microRegionId: 'GRA11',
        macroRegionId: 'GRA',
        continentIds: ['western_europe', 'north_america'],
        description:
          'macroRegion with multiple continentIds but not asia_oceania',
      },
    ])(
      'should return false for $description',
      ({ microRegionId, macroRegionId, continentIds }) => {
        const catalog = createMinimalCatalog(
          [{ id: microRegionId, macroRegionId }],
          [{ id: macroRegionId, continentIds }],
        );
        expect(isAPACRegion(microRegionId)(catalog)).toBe(false);
      },
    );
  });
});
