import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useListener, useDeleteListener } from './useListener';
import { getListener, deleteListener } from '@/api/data/listener';
import { wrapper } from '@/wrapperRenders';
import { TLoadBalancerListener } from '../data/load-balancer';

vi.mock('@/api/data/listener');

describe('useListener', () => {
  const projectId = 'test-project';
  const region = 'test-region';
  const loadBalancerId = 'test-loadbalancer';
  const listenerId = 'test-listener';

  it('fetches listener data successfully', async () => {
    vi.mocked(getListener).mockResolvedValueOnce({
      id: listenerId,
    } as TLoadBalancerListener);

    const { result } = renderHook(
      () => useListener({ projectId, region, loadBalancerId, listenerId }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ id: listenerId });
    expect(getListener).toHaveBeenCalledWith(projectId, region, listenerId);
  });
});

describe('useDeleteListener', () => {
  const projectId = 'test-project';
  const region = 'test-region';
  const loadBalancerId = 'test-loadbalancer';
  const listenerId = 'test-listener';
  const onError = vi.fn();
  const onSuccess = vi.fn();

  it('deletes listener successfully', async () => {
    vi.mocked(deleteListener).mockResolvedValueOnce({});

    const { result } = renderHook(
      () =>
        useDeleteListener({
          projectId,
          region,
          loadBalancerId,
          listenerId,
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.deleteListener();
    });

    expect(deleteListener).toHaveBeenCalledWith(projectId, region, listenerId);
    expect(onSuccess).toHaveBeenCalled();
  });

  it('handles error while deleting listener', async () => {
    const error = new Error('Failed to delete');
    vi.mocked(deleteListener).mockRejectedValueOnce(error);

    const { result } = renderHook(
      () =>
        useDeleteListener({
          projectId,
          region,
          loadBalancerId,
          listenerId,
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.deleteListener();
    });

    expect(deleteListener).toHaveBeenCalledWith(projectId, region, listenerId);
    expect(onError).toHaveBeenCalled();
  });
});
