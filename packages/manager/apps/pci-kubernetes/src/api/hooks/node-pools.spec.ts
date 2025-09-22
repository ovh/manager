import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';

import * as ApiNodePoolsModule from '@/api/data/node-pools';
import { TClusterNodePool } from '@/api/data/node-pools';
import { useClusterNodePools, useUpdateNodePoolSize } from '@/api/hooks/node-pools';
import { wrapper } from '@/wrapperRenders';

vi.mock('@ovh-ux/manager-core-utils');

describe('useClusterNodePools', () => {
  it.skip('fetches cluster node pools successfully', async () => {
    const mockData = [
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
        availabilityZones: ['zone1'],
      },
    ] as TClusterNodePool[];

    const mockResulData = [
      {
        ...mockData[0],
        createdAt: '01 Jan 2023 01:00:00',
      },
    ];

    vi.spyOn(ApiNodePoolsModule, 'getClusterNodePools').mockResolvedValueOnce(mockData);
    vi.mocked(getDateFnsLocale).mockResolvedValue('fr');

    const { result } = renderHook(() => useClusterNodePools('project1', 'cluster1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResulData);
  });
});

describe('useUpdateNodePoolSize', () => {
  it('updates node pool size successfully', async () => {
    const mockSuccess = vi.fn();
    const mockError = vi.fn();
    const param = {
      desiredNodes: 3,
      minNodes: 1,
      maxNodes: 5,
      autoscale: true,
    };
    vi.spyOn(ApiNodePoolsModule, 'updateNodePoolSize').mockResolvedValue({} as never);
    const { result } = renderHook(
      () =>
        useUpdateNodePoolSize({
          projectId: 'project1',
          clusterId: 'cluster1',
          poolId: 'pool1',
          onError: mockError,
          onSuccess: mockSuccess,
        }),
      { wrapper },
    );
    act(() => {
      result.current.updateSize(param);
    });
    await waitFor(() => expect(mockSuccess).toHaveBeenCalled());
    expect(mockError).not.toHaveBeenCalled();
  });
});
