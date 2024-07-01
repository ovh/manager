import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import {
  useAttachVolume,
  useDeleteVolume,
  useVolume,
  useVolumes,
} from '@/api/hooks/useVolume';

vi.mock('@/api/data/volume', () => ({
  getVolume: vi.fn(),
  getAllVolumes: vi.fn(),
  deleteVolume: vi.fn(),
  attachVolume: vi.fn(),
  detachVolume: vi.fn(),
  paginateResults: vi.fn(),
  sortResults: vi.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useVolume', () => {
  it('returns volume data when volumeId is provided', async () => {
    const volume = { id: '1', name: 'Volume 1' };
    const getVolume = vi.fn().mockResolvedValue(volume);

    const { result } = renderHook(() => useVolume('123', '1'), {
      wrapper,
    });

    waitFor(() => {
      expect(getVolume).toHaveBeenCalledWith('123', '1');
      expect(result.current.data).toEqual(volume);
    });
  });

  it('does not fetch data when volumeId is not provided', () => {
    const getVolume = vi.fn();
    const { result } = renderHook(() => useVolume('123', null), { wrapper });

    expect(getVolume).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });
});

describe('useVolumes', () => {
  it('returns volumes data when projectId is provided', async () => {
    const volumes = [
      { id: '1', name: 'Volume 1' },
      { id: '2', name: 'Volume 2' },
    ];
    const getAllVolumes = vi.fn().mockResolvedValue(volumes);

    const { result } = renderHook(
      () =>
        useVolumes('123', {
          pagination: { pageIndex: 1, pageSize: 10 },
          sorting: { id: 'name', desc: false },
        }),
      {
        wrapper,
      },
    );

    waitFor(() => {
      expect(getAllVolumes).toHaveBeenCalledWith('123');
      expect(result.current.data).toEqual(volumes);
    });
  });

  it('does not fetch data when projectId is not provided', () => {
    const getAllVolumes = vi.fn();
    const { result } = renderHook(
      () =>
        useVolumes(null, {
          pagination: { pageIndex: 1, pageSize: 10 },
          sorting: { id: 'name', desc: false },
        }),
      { wrapper },
    );

    expect(getAllVolumes).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });
});

describe('useDeleteVolume', () => {
  it('deletes volume when volumeId is provided', async () => {
    const deleteVolume = vi.fn().mockResolvedValue(null);
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useDeleteVolume({
          projectId: '123',
          volumeId: '1',
          onSuccess,
          onError,
        }),
      {
        wrapper,
      },
    );

    act(() => result.current.mutate());

    waitFor(() => {
      expect(deleteVolume).toHaveBeenCalledWith('123', '1');
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('does not delete volume when volumeId is not provided', () => {
    const deleteVolume = vi.fn();
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useDeleteVolume({
          projectId: '123',
          volumeId: null,
          onSuccess,
          onError,
        }),
      {
        wrapper,
      },
    );

    expect(deleteVolume).not.toHaveBeenCalled();
    expect(result.current.isIdle).toBe(true);
  });
});

describe('useAttachVolume', () => {
  it('attaches volume when volumeId and instanceId are provided', async () => {
    const attachVolume = vi
      .fn()
      .mockResolvedValue({ id: '1', name: 'Volume 1' });
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useAttachVolume({
          projectId: '123',
          volumeId: '1',
          instanceId: '1',
          onSuccess,
          onError,
        }),
      {
        wrapper,
      },
    );

    act(() => result.current.mutate());

    waitFor(() => {
      expect(attachVolume).toHaveBeenCalledWith('123', '1', '1');
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});

describe('useDetachVolume', () => {
  it('detaches volume when volumeId and instanceId are provided', async () => {
    const detachVolume = vi
      .fn()
      .mockResolvedValue({ id: '1', name: 'Volume 1' });
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useAttachVolume({
          projectId: '123',
          volumeId: '1',
          instanceId: '1',
          onSuccess,
          onError,
        }),
      {
        wrapper,
      },
    );

    act(() => result.current.mutate());

    waitFor(() => {
      expect(detachVolume).toHaveBeenCalledWith('123', '1', '1');
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
