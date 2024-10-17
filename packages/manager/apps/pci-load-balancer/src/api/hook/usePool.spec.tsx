import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  useAllLoadBalancerPools,
  useGetPool,
  useDeletePool,
  useCreatePool,
  useUpdatePool,
} from './usePool';
import {
  getLoadBalancerPools,
  getPool,
  deletePool,
  createPool,
  updatePool,
  TLoadBalancerPool,
} from '@/api/data/pool';
import { wrapper } from '@/wrapperRenders';

vi.mock('@/api/data/pool');

describe('usePool hooks', () => {
  it('should fetch all load balancer pools', async () => {
    const mockData = [
      {
        id: '1',
        name: 'pool1',
        algorithm: 'round-robin',
        protocol: 'http',
        search: 'pool1 round-robin http',
      },
    ] as TLoadBalancerPool[];
    vi.mocked(getLoadBalancerPools).mockResolvedValue(mockData);

    const { result } = renderHook(
      () =>
        useAllLoadBalancerPools({
          projectId: '1',
          region: 'us',
          loadBalancerId: 'lb1',
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });

  it('should fetch a single pool', async () => {
    const mockPool = {
      id: '1',
      name: 'pool1',
      algorithm: 'round-robin',
      protocol: 'http',
    } as TLoadBalancerPool;
    vi.mocked(getPool).mockResolvedValue(mockPool);

    const { result } = renderHook(
      () => useGetPool({ projectId: '1', region: 'us', poolId: '1' }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPool);
  });

  it('should delete a pool', async () => {
    vi.mocked(deletePool).mockResolvedValue({});

    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useDeletePool({ projectId: '1', region: 'us', onError, onSuccess }),
      { wrapper },
    );

    await act(async () => {
      result.current.deletePool('1');
    });

    expect(deletePool).toHaveBeenCalledWith('1', 'us', '1');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should create a pool', async () => {
    const mockPool = {
      id: '1',
      name: 'pool1',
      algorithm: 'round-robin',
      protocol: 'http',
    } as TLoadBalancerPool;
    vi.mocked(createPool).mockResolvedValue(mockPool);

    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useCreatePool({
          projectId: '1',
          region: 'us',
          loadbalancerId: 'lb1',
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.doCreatePool({
        name: 'pool1',
        algorithm: 'round-robin',
        protocol: 'http',
        permanentSession: { isEnabled: true },
      });
    });

    expect(createPool).toHaveBeenCalledWith({
      projectId: '1',
      region: 'us',
      loadbalancerId: 'lb1',
      name: 'pool1',
      algorithm: 'round-robin',
      protocol: 'http',
      permanentSession: { isEnabled: true },
    });
    expect(onSuccess).toHaveBeenCalledWith(mockPool);
  });

  it('should update a pool', async () => {
    const mockPool = {
      id: '1',
      name: 'pool1',
      algorithm: 'round-robin',
      protocol: 'http',
    } as TLoadBalancerPool;
    vi.mocked(updatePool).mockResolvedValue(mockPool);

    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useUpdatePool({
          projectId: '1',
          region: 'us',
          poolId: '1',
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.doUpdatePool({
        name: 'pool1',
        algorithm: 'round-robin',
        permanentSession: { isEnabled: true },
      });
    });

    expect(updatePool).toHaveBeenCalledWith({
      projectId: '1',
      region: 'us',
      poolId: '1',
      name: 'pool1',
      algorithm: 'round-robin',
      permanentSession: { isEnabled: true },
    });
    expect(onSuccess).toHaveBeenCalledWith(mockPool);
  });
});
