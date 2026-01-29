import { describe, expect, it } from 'vitest';

import { mapNetworkDtoToNetwork } from '../mapper';

describe('mapNetworkDtoToNetwork', () => {
  it.each([
    {
      description: 'should map public network',
      dto: {
        id: 'net-456',
        name: 'My Public Network',
        region: 'BHS5',
        visibility: 'public' as const,
      },
    },
    {
      description: 'should map private network',
      dto: {
        id: 'net-789',
        name: 'My Private Network',
        region: 'SBG5',
        visibility: 'private' as const,
      },
    },
  ])('$description', ({ dto }) => {
    const result = mapNetworkDtoToNetwork(dto);

    expect(result).toEqual({
      id: dto.id,
      name: dto.name,
      region: dto.region,
      visibility: dto.visibility,
    });
  });
});
