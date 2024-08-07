import { v6 } from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import { getPrivateNetworkSubnets } from '@/api/data/subnets';

describe('getPrivateNetworkSubnets', () => {
  it('fetches private network subnets successfully', async () => {
    const mockData = [
      {
        id: 'subnet1',
        cidr: '192.168.1.0/24',
        gatewayIp: '192.168.1.1',
        displayedLabel: 'Subnet 1',
        ipPools: [
          {
            dhcp: true,
            end: '192.168.1.254',
            network: '192.168.1.0',
            region: 'region1',
            start: '192.168.1.2',
          },
        ],
      },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getPrivateNetworkSubnets('project1', 'network1');
    expect(result).toEqual(mockData);
  });

  it('handles empty private network subnets response', async () => {
    const mockData = [];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getPrivateNetworkSubnets('project1', 'network1');
    expect(result).toEqual(mockData);
  });

  it('handles error when fetching private network subnets', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));
    await expect(
      getPrivateNetworkSubnets('project1', 'network1'),
    ).rejects.toThrow('Network Error');
  });
});
