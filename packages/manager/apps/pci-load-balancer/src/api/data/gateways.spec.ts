import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getSubnetGateways, TSubnetGateway } from './gateways';

describe('getSubnetGateways', () => {
  const projectId = 'test-project';
  const regionName = 'test-region';
  const subnetId = 'test-subnet';

  const mockGateways: TSubnetGateway[] = [
    {
      externalInformation: {
        ips: [{ ip: '192.168.1.1', subnetId: 'subnet-1' }],
        networkId: 'network-1',
      },
      id: 'gateway-1',
      interfaces: [
        {
          id: 'interface-1',
          ip: '192.168.1.2',
          networkId: 'network-1',
          subnetId: 'subnet-1',
        },
      ],
      model: 'model-1',
      name: 'gateway-name-1',
      region: 'region-1',
      status: 'ACTIVE',
    },
  ];

  it('should fetch subnet gateways and return data', async () => {
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockGateways });

    const result = await getSubnetGateways(projectId, regionName, subnetId);

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${regionName}/gateway?subnetId=${subnetId}`,
    );
    expect(result).toEqual(mockGateways);
  });

  it('should handle empty response', async () => {
    vi.mocked(v6.get).mockResolvedValueOnce({ data: [] });

    const result = await getSubnetGateways(projectId, regionName, subnetId);

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${regionName}/gateway?subnetId=${subnetId}`,
    );
    expect(result).toEqual([]);
  });

  it('should handle API errors', async () => {
    const errorMessage = 'API Error';
    vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      getSubnetGateways(projectId, regionName, subnetId),
    ).rejects.toThrow(errorMessage);
  });
});
