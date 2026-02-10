import { describe, expect, it } from 'vitest';

import { TMacroRegion, TMicroRegion, TShareSpecs } from '@/domain/entities/catalog.entity';

import {
  getMicroRegions,
  isMacroRegionAvailable,
  isMicroRegionAvailable,
  provisionedPerformanceCalculator,
} from '../catalog.service';

describe('catalog.service', () => {
  describe('isMicroRegionAvailable', () => {
    it.each([
      {
        description: 'should return true when activated and not in maintenance',
        microRegion: { isActivable: true, isInMaintenance: false } as TMicroRegion,
        expected: true,
      },
      {
        description: 'should return false when not activated',
        microRegion: { isActivable: false, isInMaintenance: false } as TMicroRegion,
        expected: false,
      },
      {
        description: 'should return false when in maintenance',
        microRegion: { isActivable: true, isInMaintenance: true } as TMicroRegion,
        expected: false,
      },
      {
        description: 'should return false when not activated and in maintenance',
        microRegion: { isActivable: false, isInMaintenance: true } as TMicroRegion,
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
    const createMicroRegion = (name: string, isInMaintenance: boolean, isActivable: boolean) =>
      ({
        name,
        isInMaintenance,
        isActivable,
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

  describe('provisionedPerformanceCalculator', () => {
    const generalShareSpec: TShareSpecs = {
      name: 'share-spec',
      microRegionIds: ['GRA1', 'GRA2'],
      capacity: { min: 150, max: 10240 },
      pricing: { price: 11900, interval: 'hour' },
      iops: {
        level: 24,
        max: 16000,
        guaranteed: false,
        unit: 'IOPS',
        maxUnit: 'IOPS',
      },
      bandwidth: {
        level: 0.25,
        min: 25,
        max: 128,
        unit: 'MB/s/GB',
        maxUnit: 'MB/s/GB',
        guaranteed: false,
      },
    };

    it.each([
      {
        description:
          'should return minimum throughput and calculate IOPS relative to the size for size 99 GiB',
        size: 99,
        expectedResult: { iops: 2376, throughput: 25 },
        shareSpec: generalShareSpec,
      },
      {
        description: 'should calculate IOPS and throughput relative to the size for size 500 GiB',
        size: 500,
        expectedResult: { iops: 12000, throughput: 125 },
        shareSpec: generalShareSpec,
      },
      {
        description: 'should return maximum values for IOPS and throughput',
        size: 670,
        expectedResult: { iops: 16000, throughput: 128 },
        expectedThroughput: 128,
        shareSpec: generalShareSpec,
      },
      {
        description:
          'iops level of 1 should return the same value as the share size if it is less than the iops max',
        size: 99,
        expectedResult: { iops: 99, throughput: 25 },
        shareSpec: {
          ...generalShareSpec,
          iops: { ...generalShareSpec.iops, level: 1 },
        },
      },
      {
        description: 'should return minimum throughput and 0 IOPS when size is 0',
        size: 0,
        expectedResult: { iops: 0, throughput: 25 },
        shareSpec: generalShareSpec,
      },
      {
        description: 'should return minimum throughput and 0 IOPS when size is negative',
        size: -1,
        expectedResult: { iops: 0, throughput: 25 },
        shareSpec: generalShareSpec,
      },
      {
        description: 'should return null when size is NaN',
        size: NaN,
        expectedResult: null,
        shareSpec: generalShareSpec,
      },
    ])('$description', ({ size, expectedResult, shareSpec }) => {
      const calculateProvisionedPerformance = provisionedPerformanceCalculator(shareSpec);
      const result = calculateProvisionedPerformance(size);
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
