import { describe, expect, it } from 'vitest';

import { TNetwork } from '@/domain/entities/network.entity';

import { mapNetworkToPrivateNetworkData } from '../network.mapper';

describe('mapNetworkToPrivateNetworkData', () => {
  it('should map network entity to private network data', () => {
    const network: TNetwork = {
      id: 'net-123',
      name: 'My Private Network',
      region: 'GRA7',
      visibility: 'private',
    };

    const result = mapNetworkToPrivateNetworkData(network);

    expect(result).toEqual({
      label: 'My Private Network',
      value: 'net-123',
    });
  });
});
