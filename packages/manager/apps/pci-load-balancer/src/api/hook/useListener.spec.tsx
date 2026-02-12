import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { Filter, applyFilters } from '@ovh-ux/manager-core-api';

import {
  TLoadBalancerListener,
  createListener,
  deleteListener,
  editListener,
  getListener,
  getLoadBalancerListeners,
} from '@/api/data/listener';
import { paginateResults, sortResults } from '@/helpers';
import { wrapper } from '@/wrapperRenders';

import {
  ListenerInfoProps,
  useAllLoadBalancerListeners,
  useCreateListener,
  useDeleteListener,
  useEditLoadBalancer,
  useListener,
  useLoadBalancerListeners,
} from './useListener';

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

  it('deletes listener successfully', () => {
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

    act(() => {
      void result.current.deleteListener();
    });

    expect(deleteListener).toHaveBeenCalledWith(projectId, region, listenerId);
    expect(onSuccess).toHaveBeenCalled();
  });

  it('handles error while deleting listener', () => {
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

    act(() => {
      result.current.deleteListener();
    });

    expect(deleteListener).toHaveBeenCalledWith(projectId, region, listenerId);
    expect(onError).toHaveBeenCalled();
  });
});

describe('useCreateListener', () => {
  it('should create a listener', async () => {
    vi.mocked(createListener).mockResolvedValue({} as TLoadBalancerListener);
    const onError = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useCreateListener({
          projectId: 'projectId',
          region: 'region',
          loadBalancerId: 'loadBalancerId',
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    const listenerInfo = {
      name: 'listener1',
      protocol: 'http',
      port: 80,
    } as ListenerInfoProps;

    act(() => {
      void result.current.createListener(listenerInfo);
    });
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());

    expect(createListener).toHaveBeenCalledWith({
      projectId: 'projectId',
      region: 'region',
      loadBalancerId: 'loadBalancerId',
      ...listenerInfo,
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe('useEditLoadBalancer', () => {
  it('should edit a listener', async () => {
    vi.mocked(editListener).mockResolvedValue({} as TLoadBalancerListener);
    const onError = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useEditLoadBalancer({
          projectId: 'projectId',
          region: 'region',
          listenerId: 'listenerId',
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    const listenerInfo = {
      name: 'listener1',
      defaultPoolId: 'poolId',
    };

    act(() => {
      void result.current.editListener(listenerInfo);
    });
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());

    expect(editListener).toHaveBeenCalledWith({
      projectId: 'projectId',
      region: 'region',
      listenerId: 'listenerId',
      ...listenerInfo,
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe('useAllLoadBalancerListeners', () => {
  it('should fetch all load balancer listeners', async () => {
    const mockData = [{ id: '1', name: 'listener1' }] as TLoadBalancerListener[];
    vi.mocked(getLoadBalancerListeners).mockResolvedValue(mockData);

    const { result } = renderHook(
      () =>
        useAllLoadBalancerListeners({
          projectId: 'projectId',
          region: 'region',
          loadBalancerId: 'loadBalancerId',
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(
      mockData.map((listener) => ({
        ...listener,
        search: `${listener.name} ${listener.defaultPoolId} ${listener.protocol} ${listener.port}`,
      })),
    );
  });
});

describe('useLoadBalancerListeners', () => {
  it('should return paginated and sorted load balancer listeners', async () => {
    const mockData = [{ id: '1', name: 'listener1' }] as TLoadBalancerListener[];
    vi.mocked(getLoadBalancerListeners).mockResolvedValue(mockData);
    vi.mocked(applyFilters).mockReturnValue(mockData);
    vi.mocked(sortResults).mockReturnValue(mockData);
    vi.mocked(paginateResults).mockReturnValue({
      rows: mockData,
      pageCount: 1,
      totalRows: 1,
    });

    const pagination = { pageIndex: 0, pageSize: 10 };
    const sorting = { id: 'name', desc: false };
    const filters: Filter[] = [];

    const { result } = renderHook(
      () =>
        useLoadBalancerListeners(
          'projectId',
          'region',
          'loadBalancerId',
          pagination,
          sorting,
          filters,
        ),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual({
      rows: mockData,
      pageCount: 1,
      totalRows: 1,
    });
  });
});
