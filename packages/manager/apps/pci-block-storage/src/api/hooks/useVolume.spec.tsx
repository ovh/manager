import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import {
  useAllVolumes,
  useAttachVolume,
  useDeleteVolume,
  useDetachVolume,
  useVolume,
  useVolumes,
} from '@/api/hooks/useVolume';
import {
  attachVolume,
  deleteVolume,
  detachVolume,
  getAllVolumes,
  getVolume,
  TAPIVolume,
} from '@/api/data/volume';
import {
  mapVolumeAttach,
  mapVolumeEncryption,
  mapVolumePricing,
  mapVolumeRegion,
  mapVolumeStatus,
  mapVolumeType,
  paginateResults,
  sortResults,
} from '@/api/select/volume';

vi.mock('@/api/data/volume', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    getVolume: vi.fn(),
    getAllVolumes: vi.fn(),
    deleteVolume: vi.fn(),
    attachVolume: vi.fn(),
    detachVolume: vi.fn(),
  };
});

vi.mock('@/api/select/volume', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    mapVolumeAttach: vi.fn().mockReturnValue(vi.fn()),
    mapVolumeEncryption: vi.fn().mockReturnValue(vi.fn()),
    mapVolumePricing: vi.fn().mockReturnValue(vi.fn()),
    mapVolumeRegion: vi.fn().mockReturnValue(vi.fn()),
    mapVolumeStatus: vi.fn().mockReturnValue(vi.fn()),
    mapVolumeToAdd: vi.fn().mockReturnValue(vi.fn()),
    mapVolumeToEdit: vi.fn().mockReturnValue(vi.fn()),
    mapVolumeType: vi.fn().mockReturnValue(vi.fn()),
    paginateResults: vi.fn(),
    sortResults: vi.fn(),
  };
});

vi.mock('@/api/data/catalog');

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

afterAll(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

const onSuccess = vi.fn();
const onError = vi.fn();

describe('useVolume', () => {
  it('returns mapped volume data when volumeId is provided', async () => {
    const volumeMock = { id: '1' } as TAPIVolume;

    vi.mocked(getVolume).mockResolvedValue(volumeMock);

    const { result } = renderHook(() => useVolume('123', '1'), {
      wrapper,
    });

    await waitFor(() => {
      expect(getVolume).toHaveBeenCalledWith('123', '1');
      expect(mapVolumeAttach).toHaveBeenCalled();
      expect(mapVolumeEncryption).toHaveBeenCalled();
      expect(mapVolumeStatus).toHaveBeenCalled();
      expect(mapVolumeRegion).toHaveBeenCalled();
      expect(mapVolumePricing).toHaveBeenCalled();
      expect(result.current.isPending).toBe(false);
    });
  });

  it('does not fetch data when volumeId is not provided', () => {
    const { result } = renderHook(() => useVolume('123', null), { wrapper });

    expect(getVolume).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });
});

describe('useVolumes', () => {
  it('returns volumes data mapped, paginated and sorted when projectId is provided', async () => {
    const volumesMock: TAPIVolume[] = [
      { id: '1' },
      { id: '2' },
    ] as TAPIVolume[];

    vi.mocked(getAllVolumes).mockResolvedValue(volumesMock);

    const { result } = renderHook(
      () =>
        useVolumes('123', {
          pagination: { pageIndex: 0, pageSize: 10 },
          sorting: { id: 'name', desc: false },
        }),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(getAllVolumes).toHaveBeenCalledWith('123');
      expect(mapVolumeStatus).toHaveBeenCalled();
      expect(mapVolumeRegion).toHaveBeenCalled();
      expect(mapVolumeAttach).toHaveBeenCalled();
      expect(mapVolumeEncryption).toHaveBeenCalled();
      expect(mapVolumeType).toHaveBeenCalled();
      expect(paginateResults).toHaveBeenCalled();
      expect(sortResults).toHaveBeenCalled();
      expect(result.current.isPending).toBe(false);
    });
  });

  it('does not fetch data when projectId is not provided', () => {
    const { result } = renderHook(
      () =>
        useVolumes(null, {
          pagination: { pageIndex: 0, pageSize: 10 },
          sorting: { id: 'name', desc: false },
        }),
      { wrapper },
    );

    expect(getAllVolumes).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });
});

describe('useAllVolumes', () => {
  it('returns volumes data when projectId is provided', async () => {
    const volumesMock: TAPIVolume[] = [
      { id: '1' },
      { id: '2' },
    ] as TAPIVolume[];

    vi.mocked(getAllVolumes).mockResolvedValue(volumesMock);

    const { result } = renderHook(() => useAllVolumes('123'), {
      wrapper,
    });

    await waitFor(() => {
      expect(getAllVolumes).toHaveBeenCalledWith('123');
      expect(getAllVolumes).toHaveBeenCalledWith('123');
      expect(mapVolumeStatus).toHaveBeenCalled();
      expect(mapVolumeRegion).toHaveBeenCalled();
      expect(mapVolumeAttach).toHaveBeenCalled();
      expect(mapVolumeEncryption).toHaveBeenCalled();
      expect(mapVolumeType).toHaveBeenCalled();
      expect(result.current.isPending).toBe(false);
    });
  });

  it('does not fetch data when projectId is not provided', () => {
    const { result } = renderHook(() => useAllVolumes(null), { wrapper });

    expect(getAllVolumes).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });
});

describe('useDeleteVolume', () => {
  it('deletes volume when volumeId is provided', async () => {
    vi.mocked(deleteVolume).mockResolvedValue(null);

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

    await waitFor(() => {
      expect(deleteVolume).toHaveBeenCalledWith('123', '1');
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('does not delete volume when volumeId is not provided', () => {
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
    vi.mocked(attachVolume).mockResolvedValue({
      id: '1',
      name: 'Volume 1',
      attachedTo: [],
      creationDate: '',
      description: '',
      size: 0,
      status: 'available',
      region: 'region',
      bootable: false,
      planCode: '',
      type: '',
      availabilityZone: 'any',
    } as TAPIVolume);

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

    await waitFor(() => {
      expect(attachVolume).toHaveBeenCalledWith('123', '1', '1');
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});

describe('useDetachVolume', () => {
  it('detaches volume when volumeId and instanceId are provided', async () => {
    vi.mocked(detachVolume).mockResolvedValue({
      id: '1',
      name: 'Volume 1',
      attachedTo: [],
      creationDate: '',
      description: '',
      size: 0,
      status: 'available',
      region: 'region',
      bootable: false,
      planCode: '',
      type: '',
      availabilityZone: 'any',
    } as TAPIVolume);

    const { result } = renderHook(
      () =>
        useDetachVolume({
          onSuccess,
          onError,
        }),
      {
        wrapper,
      },
    );

    act(() =>
      result.current.mutate({
        projectId: '123',
        volumeId: '1',
        instanceId: '1',
      }),
    );

    await waitFor(() => {
      expect(detachVolume).toHaveBeenCalledWith('123', '1', '1');
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
