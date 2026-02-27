import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TNetwork } from '@/domain/entities/network.entity';

import { generateAutoName, selectPrivateNetworksForRegion } from '../network.view-model';

vi.mock('@/domain/services/network.service', () => ({
  getPrivateNetworks: (networks: TNetwork[]) => networks,
}));

describe('network.view-model', () => {
  describe('selectPrivateNetworksForRegion', () => {
    const createNetwork = (id: string, name: string, region: string): TNetwork =>
      ({
        id,
        name,
        region,
      }) as TNetwork;

    it.each([
      {
        description: 'should return private networks mapped to UI data',
        region: 'GRA7',
        networks: [
          createNetwork('net1', 'Private Network 1', 'GRA7'),
          createNetwork('net3', 'Private Network 2', 'GRA7'),
        ],
        expected: [
          { label: 'Private Network 1', value: 'net1' },
          { label: 'Private Network 2', value: 'net3' },
        ],
      },
      {
        description: 'should return empty array when networks is undefined',
        region: 'GRA7',
        networks: undefined,
        expected: [],
      },
      {
        description: 'should return empty array when region is undefined',
        region: undefined,
        networks: [
          createNetwork('net1', 'Private Network 1', 'GRA7'),
          createNetwork('net3', 'Private Network 2', 'GRA7'),
        ],
        expected: [],
      },
      {
        description: 'should return empty array when both are undefined',
        region: undefined,
        networks: undefined,
        expected: [],
      },
      {
        description: 'should return empty array when networks array is empty',
        region: 'GRA7',
        networks: [],
        expected: [],
      },
    ])('$description', ({ region, networks, expected }) => {
      const result = selectPrivateNetworksForRegion(region)(networks);

      expect(result).toEqual(expected);
    });
  });

  describe('generateAutoName', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it.each([
      {
        description: 'should generate name with default specName',
        specName: undefined,
        expectedPattern: /^share_2024_01_15_\d\d_30_00$/,
      },
      {
        description: 'should generate name with provided specName',
        specName: 'standard-1az',
        expectedPattern: /^standard-1az_2024_01_15_\d\d_30_00$/,
      },
      {
        description: 'should sanitize special characters in specName',
        specName: 'share@#$% ^&*()name',
        expectedPattern: /^share_+name_2024_01_15_\d\d_30_00$/,
      },
      {
        description: 'should truncate long specName to 200 characters',
        specName: 'a'.repeat(250),
        expectedPattern: /^a{200}_2024_01_15_\d\d_30_00$/,
      },
      {
        description: 'should handle empty string specName',
        specName: '',
        expectedPattern: /^_2024_01_15_\d\d_30_00$/,
      },
    ])('$description', ({ specName, expectedPattern }) => {
      const fixedDate = new Date('2024-01-15T10:30:00Z');
      vi.setSystemTime(fixedDate);

      const result = generateAutoName(specName);

      expect(result).toMatch(expectedPattern);
    });
  });
});
