import { describe, it, vi } from 'vitest';

import { v6 } from '@ovh-ux/manager-core-api';

import { TGateway, getListGateways, getPrivateNetworkSubnets } from '@/api/data/subnets';

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
    await expect(getPrivateNetworkSubnets('project1', 'network1')).rejects.toThrow('Network Error');
  });
});

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn(),
  },
}));

describe('getListGateways', () => {
  const projectId = 'project1';
  const regionName = 'GRA';
  const subnetId = 'subnet1';

  it('fetches gateways successfully', async () => {
    const mockData: TGateway[] = [
      {
        id: 'gw-123',
        name: 'gateway-1',
        status: 'active',
      } as TGateway,
    ];

    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const result = await getListGateways(projectId, regionName, subnetId);

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${regionName}/gateway?subnetId=${subnetId}`,
    );
    expect(result).toEqual(mockData);
  });

  it('returns empty list when no gateways found', async () => {
    const mockData: TGateway[] = [];

    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const result = await getListGateways(projectId, regionName, subnetId);

    expect(result).toEqual(mockData);
  });

  it('throws error on network failure', async () => {
    const error = new Error('API Error');

    vi.mocked(v6.get).mockRejectedValue(error);

    await expect(getListGateways(projectId, regionName, subnetId)).rejects.toThrow('API Error');
  });
});
