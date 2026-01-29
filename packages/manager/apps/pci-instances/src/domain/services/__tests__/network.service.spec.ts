import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOvhPrivateNetwork } from '../network.service';
import { mockedPrivateNetworkEntity } from '@/__mocks__/instance/constants';
import { TPrivateNetwork } from '@/domain/entities/configuration';

const CURRENT_DATE_MOCK = '01022025';

const privateNetworksWithVlan1Taken: TPrivateNetwork = {
  networks: {
    byId: new Map([
      [
        'net-with-vlan-1',
        {
          id: 'net-with-vlan-1',
          name: 'existing-network',
          region: 'BHS5',
          vlanId: 1,
          subnets: [],
        },
      ],
    ]),
    allIds: ['net-with-vlan-1'],
  },
  subnets: { byId: new Map(), allIds: [] },
};

vi.mock('date-fns', () => ({
  format: vi.fn(() => CURRENT_DATE_MOCK),
}));

describe('getOvhPrivateNetwork', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns name, vlanId, cidr and enableDhcp with the smallest available vlanId available', () => {
    const result = getOvhPrivateNetwork('BHS5', mockedPrivateNetworkEntity);

    expect(result).toStrictEqual({
      name: `pn-BHS5-${CURRENT_DATE_MOCK}`,
      vlanId: 1,
      cidr: `10.${1 % 255}.0.0/16`,
      enableDhcp: true,
    });
  });

  it('returns next smallest available vlanId when vlanId 1 is already taken', () => {
    const result = getOvhPrivateNetwork('BHS5', privateNetworksWithVlan1Taken);

    expect(result).toStrictEqual({
      name: `pn-BHS5-${CURRENT_DATE_MOCK}`,
      vlanId: 2,
      cidr: '10.2.0.0/16',
      enableDhcp: true,
    });
  });
});
