import { describe, expect, it, vi } from 'vitest';

import { TNetwork } from '@/domain/entities/network.entity';

import { selectPrivateNetworksForRegion } from '../network.view-model';

vi.mock('@/adapters/network/left/network.mapper', () => ({
  mapNetworkToPrivateNetworkData: (network: TNetwork) => ({
    label: network.name,
    value: network.id,
  }),
}));

vi.mock('@/domain/services/network.service', () => ({
  getPrivateNetworks: (networks: TNetwork[]) =>
    networks.filter((network) => network.visibility === 'private'),
}));

describe('network.view-model', () => {
  describe('selectPrivateNetworksForRegion', () => {
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
        description: 'should return private networks mapped to UI data',
        region: 'GRA7',
        networks: [
          createNetwork('net1', 'Private Network 1', 'GRA7', 'private'),
          createNetwork('net2', 'Public Network', 'GRA7', 'public'),
          createNetwork('net3', 'Private Network 2', 'GRA7', 'private'),
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
          createNetwork('net1', 'Private Network 1', 'GRA7', 'private'),
          createNetwork('net2', 'Public Network', 'GRA7', 'public'),
          createNetwork('net3', 'Private Network 2', 'GRA7', 'private'),
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
      {
        description: 'should return empty array when no private networks exist',
        region: 'GRA7',
        networks: [
          createNetwork('net1', 'Public Network 1', 'GRA7', 'public'),
          createNetwork('net2', 'Public Network 2', 'GRA7', 'public'),
        ],
        expected: [],
      },
    ])('$description', ({ region, networks, expected }) => {
      const result = selectPrivateNetworksForRegion(region)(networks);

      expect(result).toEqual(expected);
    });
  });
});
