import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getFloatingIps, TFloatingIp } from './floating-ips';

describe('getFloatingIps', () => {
  const projectId = 'test-project-id';
  const region = 'test-region';
  const mockFloatingIps: TFloatingIp[] = [
    {
      associatedEntity: 'entity1',
      id: 'id1',
      ip: '192.168.1.1',
      networkId: 'network1',
      status: 'active',
      type: 'public',
    },
    {
      associatedEntity: 'entity2',
      id: 'id2',
      ip: '192.168.1.2',
      networkId: 'network2',
      status: 'inactive',
      type: 'private',
    },
  ];

  it('should fetch floating IPs for a given project and region', async () => {
    vi.mocked(v6.get).mockResolvedValue({ data: mockFloatingIps });

    const result = await getFloatingIps(projectId, region);

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/floatingip`,
    );
    expect(result).toEqual(mockFloatingIps);
  });

  it('should handle errors when fetching floating IPs', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValue(new Error(errorMessage));

    await expect(getFloatingIps(projectId, region)).rejects.toThrow(
      errorMessage,
    );
  });
});
