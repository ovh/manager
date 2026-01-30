import { describe, it, expect } from 'vitest';
import {
  mapFloatingIpDtoToEntity,
  mapNetworkDtoToPrivateNetworkEntity,
} from '../mapper';
import { TPrivateNetwork, TFloatingIp } from '@/domain/entities/configuration';
import { TNetworkDTO, TFloatingIpDTO } from '../dto.type';
import {
  mockedPrivateNetworkDTO,
  mockedPrivateNetworkEntity,
} from '@/__mocks__/instance/constants';

describe('mapFloatingIpDtoToEntity', () => {
  it('returns TFloatingIp[] with id and ip for each DTO item', () => {
    const dto: TFloatingIpDTO[] = [
      { id: 'a', ip: '1.2.3.4' },
      { id: 'b', ip: '5.6.7.8' },
    ];
    const result: TFloatingIp[] = mapFloatingIpDtoToEntity(dto);

    expect(result).toStrictEqual([
      { id: 'a', ip: '1.2.3.4' },
      { id: 'b', ip: '5.6.7.8' },
    ]);
  });

  it('returns empty array when given empty DTO array', () => {
    const dto: TFloatingIpDTO[] = [];
    const result: TFloatingIp[] = mapFloatingIpDtoToEntity(dto);

    expect(result).toStrictEqual([]);
  });
});

describe('mapNetworkDtoToPrivateNetworkEntity', () => {
  it('returns TPrivateNetwork for mockedPrivateNetworkDTO', () => {
    const result: TPrivateNetwork = mapNetworkDtoToPrivateNetworkEntity(
      mockedPrivateNetworkDTO,
    );

    expect(result).toStrictEqual(mockedPrivateNetworkEntity);
  });
});

describe('mapNetworkDtoToPrivateNetworkEntity edge cases', () => {
  it('filters out public resources and returns only private networks', () => {
    const dtoWithOnlyPublic: TNetworkDTO = {
      resources: [
        {
          id: 'public-net',
          name: 'public',
          visibility: 'public',
          vlanId: null,
          region: 'GRA11',
          subnets: null,
        },
      ],
    };
    const result: TPrivateNetwork = mapNetworkDtoToPrivateNetworkEntity(
      dtoWithOnlyPublic,
    );

    expect(result).toStrictEqual({
      networks: { byId: new Map(), allIds: [] },
      subnets: { byId: new Map(), allIds: [] },
    });
  });

  it('returns empty normalized structure when resources is empty', () => {
    const dto: TNetworkDTO = { resources: [] };
    const result: TPrivateNetwork = mapNetworkDtoToPrivateNetworkEntity(dto);

    expect(result).toStrictEqual({
      networks: { byId: new Map(), allIds: [] },
      subnets: { byId: new Map(), allIds: [] },
    });
  });
});
