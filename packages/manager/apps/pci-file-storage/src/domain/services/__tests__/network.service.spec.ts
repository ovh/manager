import { describe, expect, it } from 'vitest';

import { TNetwork } from '@/domain/entities/network.entity';

import { getPrivateNetworks } from '../network.service';

describe('network.service', () => {
  describe('getPrivateNetworks', () => {
    const createNetwork = (
      id: string,
      name: string,
      region: string,
      visibility: 'private' | 'public',
    ): TNetwork => ({
      id,
      name,
      region,
      visibility,
    });

    it.each([
      {
        description: 'should return only private networks',
        networks: [
          createNetwork('net1', 'Network 1', 'GRA7', 'private'),
          createNetwork('net2', 'Network 2', 'GRA7', 'public'),
          createNetwork('net3', 'Network 3', 'GRA7', 'private'),
        ],
        expected: [
          createNetwork('net1', 'Network 1', 'GRA7', 'private'),
          createNetwork('net3', 'Network 3', 'GRA7', 'private'),
        ],
      },
      {
        description: 'should return empty array when no private networks',
        networks: [
          createNetwork('net1', 'Network 1', 'GRA7', 'public'),
          createNetwork('net2', 'Network 2', 'GRA7', 'public'),
        ],
        expected: [],
      },
      {
        description: 'should return empty array when networks array is empty',
        networks: [],
        expected: [],
      },
    ])('$description', ({ networks, expected }) => {
      const result = getPrivateNetworks(networks);

      expect(result).toEqual(expected);
      expect(result.length).toBe(expected.length);
    });
  });
});
