import { describe, it, vi } from 'vitest';

import { v6 } from '@ovh-ux/manager-core-api';

import { deleteNode, getNodes } from '@/api/data/nodes';

describe('getNodes', () => {
  it('fetches nodes successfully', async () => {
    const mockData = [
      {
        createdAt: '2023-01-01T00:00:00Z',
        deployedAt: '2023-01-01T00:00:00Z',
        flavor: 'flavor1',
        id: 'node1',
        instanceId: 'instance1',
        isUpToDate: true,
        name: 'Node 1',
        nodepoolId: 'pool1',
        projectId: 'project1',
        status: 'READY',
        updatedAt: '2023-01-01T00:00:00Z',
        version: '1.0.0',
      },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getNodes('project1', 'cluster1', 'pool1');
    expect(result).toEqual([
      {
        ...mockData[0],
        formattedFlavor: 'flavor1',
        billingType: 'monthly',
        canSwitchToMonthly: false,
      },
    ]);
  });

  it('handles empty nodes response', async () => {
    const mockData = [];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getNodes('project1', 'cluster1', 'pool1');
    expect(result).toEqual([]);
  });

  it('handles error when fetching nodes', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));
    await expect(getNodes('project1', 'cluster1', 'pool1')).rejects.toThrow('Network Error');
  });
});

describe('deleteNode', () => {
  it('deletes node successfully', async () => {
    vi.mocked(v6.delete).mockResolvedValue({});
    await deleteNode('project1', 'cluster1', 'node1');
    expect(v6.delete).toHaveBeenCalledWith('/cloud/project/project1/kube/cluster1/node/node1');
  });

  it('handles error when deleting node', async () => {
    vi.mocked(v6.delete).mockRejectedValue(new Error('Network Error'));
    await expect(deleteNode('project1', 'cluster1', 'node1')).rejects.toThrow('Network Error');
  });
});
