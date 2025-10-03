import { describe, it, vi } from 'vitest';

import { v6 } from '@ovh-ux/manager-core-api';

import { deleteNodePool, getClusterNodePools, updateNodePoolSize } from '@/api/data/node-pools';

describe('getClusterNodePools', () => {
  it('fetches cluster node pools successfully', async () => {
    const mockData = [
      {
        id: 'pool1',
        projectId: 'project1',
        name: 'Node Pool 1',
        flavor: 'flavor1',
        status: 'READY',
        sizeStatus: 'OK',
        autoscale: true,
        monthlyBilled: false,
        antiAffinity: true,
        desiredNodes: 3,
        minNodes: 1,
        maxNodes: 5,
        currentNodes: 3,
        availableNodes: 3,
        upToDateNodes: 3,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        autoscaling: {
          scaleDownUtilizationThreshold: 0.5,
          scaleDownUnneededTimeSeconds: 300,
          scaleDownUnreadyTimeSeconds: 600,
        },
        template: {
          metadata: {
            labels: {},
            annotations: {},
            finalizers: [],
          },
          spec: {
            unschedulable: false,
            taints: [],
          },
        },
      },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getClusterNodePools('project1', 'cluster1');
    expect(result).toEqual([
      {
        id: 'pool1',
        name: 'Node Pool 1',
        antiAffinity: true,
        availableNodes: 3,
        desiredNodes: 3,
        autoscale: true,
        monthlyBilled: false,
        createdAt: '2023-01-01T00:00:00Z',
        status: 'READY',
        flavor: 'flavor1',
        minNodes: 1,
        maxNodes: 5,
      },
    ]);
  });

  it('handles empty cluster node pools response', async () => {
    const mockData = [];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getClusterNodePools('project1', 'cluster1');
    expect(result).toEqual([]);
  });

  it('handles error when fetching cluster node pools', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));
    await expect(getClusterNodePools('project1', 'cluster1')).rejects.toThrow('Network Error');
  });
});

describe('deleteNodePool', () => {
  it('deletes node pool successfully', async () => {
    vi.mocked(v6.delete).mockResolvedValue({});
    await deleteNodePool('project1', 'cluster1', 'pool1');
    expect(v6.delete).toHaveBeenCalledWith('/cloud/project/project1/kube/cluster1/nodepool/pool1');
  });

  it('handles error when deleting node pool', async () => {
    vi.mocked(v6.delete).mockRejectedValue(new Error('Network Error'));
    await expect(deleteNodePool('project1', 'cluster1', 'pool1')).rejects.toThrow('Network Error');
  });
});

describe('updateNodePoolSize', () => {
  it('updates node pool size successfully', async () => {
    const param = {
      desiredNodes: 3,
      minNodes: 1,
      maxNodes: 5,
      autoscale: true,
    };
    vi.mocked(v6.put).mockResolvedValue({});
    await updateNodePoolSize('project1', 'cluster1', 'pool1', param);
    expect(v6.put).toHaveBeenCalledWith(
      '/cloud/project/project1/kube/cluster1/nodepool/pool1',
      param,
    );
  });

  it('handles error when updating node pool size', async () => {
    const param = {
      desiredNodes: 3,
      minNodes: 1,
      maxNodes: 5,
      autoscale: true,
    };
    vi.mocked(v6.put).mockRejectedValue(new Error('Network Error'));
    await expect(updateNodePoolSize('project1', 'cluster1', 'pool1', param)).rejects.toThrow(
      'Network Error',
    );
  });
});
