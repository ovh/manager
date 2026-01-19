import { describe, expect, it } from 'vitest';

import { TMacroRegion, TMicroRegion } from '@/domain/entities/catalog.entity';

import {
  getMicroRegions,
  isMacroRegionAvailable,
  isMicroRegionAvailable,
} from '../catalog.service';

describe('catalog.service', () => {
  describe('isMicroRegionAvailable', () => {
    it.each([
      {
        description: 'should return true when activated and not in maintenance',
        microRegion: { isActivated: true, isInMaintenance: false } as TMicroRegion,
        expected: true,
      },
      {
        description: 'should return false when not activated',
        microRegion: { isActivated: false, isInMaintenance: false } as TMicroRegion,
        expected: false,
      },
      {
        description: 'should return false when in maintenance',
        microRegion: { isActivated: true, isInMaintenance: true } as TMicroRegion,
        expected: false,
      },
      {
        description: 'should return false when not activated and in maintenance',
        microRegion: { isActivated: false, isInMaintenance: true } as TMicroRegion,
        expected: false,
      },
    ])('$description', ({ microRegion, expected }) => {
      expect(isMicroRegionAvailable(microRegion)).toBe(expected);
    });
  });

  describe('getMicroRegions', () => {
    const createMicroRegion = (name: string) =>
      ({
        name,
      }) as TMicroRegion;

    it.each([
      {
        description: 'should return micro regions associated to the macro region',
        macroRegion: {
          microRegions: ['GRA1', 'GRA2', 'GRA3'],
        },
        microRegionsById: new Map<string, TMicroRegion>([
          ['GRA1', createMicroRegion('GRA1')],
          ['GRA3', createMicroRegion('GRA3')],
          ['PAR', createMicroRegion('PAR1')],
        ]),
        expectedIds: ['GRA1', 'GRA3'],
      },
      {
        description: 'should return empty array when macro region has no micro regions',
        macroRegion: {
          microRegions: [],
        },
        microRegionsById: new Map<string, TMicroRegion>(),
        expectedIds: [],
      },
      {
        description: 'should return empty array when macro region is undefined',
        macroRegion: undefined,
        microRegionsById: new Map<string, TMicroRegion>([['GRA1', createMicroRegion('GRA1')]]),
        expectedIds: [],
      },
    ])('$description', ({ macroRegion, microRegionsById, expectedIds }) => {
      const result = getMicroRegions(macroRegion as TMacroRegion | undefined, microRegionsById);

      expectedIds.forEach((id, index) => {
        expect(result[index]).toEqual(microRegionsById.get(id));
      });
    });
  });

  describe('isMacroRegionAvailable', () => {
    const createMicroRegion = (name: string, isInMaintenance: boolean, isActivated: boolean) =>
      ({
        name,
        isInMaintenance,
        isActivated,
      }) as TMicroRegion;

    it.each([
      {
        description:
          'should return true when macro region has at least one activable micro region not in maintenance',
        macroRegion: {
          microRegions: ['GRA1', 'GRA2'],
        },
        microRegionsById: new Map<string, TMicroRegion>([
          ['GRA1', createMicroRegion('GRA1', false, true)],
          ['GRA2', createMicroRegion('GRA2', true, false)],
        ]),
        expected: true,
      },
      {
        description: 'should return false when macro region has no micro regions',
        macroRegion: {
          microRegions: [],
        },
        microRegionsById: new Map<string, TMicroRegion>(),
        expected: false,
      },
      {
        description: 'should return false when all micro regions are in maintenance',
        macroRegion: {
          microRegions: ['GRA1', 'GRA2'],
        },
        microRegionsById: new Map<string, TMicroRegion>([
          ['GRA1', createMicroRegion('GRA1', true, false)],
          ['GRA2', createMicroRegion('GRA2', true, false)],
        ]),
        expected: false,
      },
      {
        description: 'should return false when all micro regions are not activable',
        macroRegion: {
          microRegions: ['GRA1', 'GRA2'],
        },
        microRegionsById: new Map<string, TMicroRegion>([
          ['GRA1', createMicroRegion('GRA1', false, false)],
          ['GRA2', createMicroRegion('GRA2', false, false)],
        ]),
        expected: false,
      },
      {
        description: 'should return false when macro region is undefined',
        macroRegion: undefined,
        microRegionsById: new Map<string, TMicroRegion>([
          ['GRA1', createMicroRegion('GRA1', false, true)],
        ]),
        expected: false,
      },
    ])('$description', ({ macroRegion, microRegionsById, expected }) => {
      const result = isMacroRegionAvailable(
        macroRegion as TMacroRegion | undefined,
        microRegionsById,
      );

      expect(result).toBe(expected);
    });
  });
});
