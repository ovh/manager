import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import {
  useAttachVolume,
  useDeleteVolume,
  useDetachVolume,
  useVolume,
  useVolumes,
} from '@/api/hooks/useVolume';
import {
  TVolume,
  getVolume,
  getAllVolumes,
  deleteVolume,
  attachVolume,
  detachVolume,
} from '@/api/data/volume';

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

vi.mock('@ovh-ux/manager-react-components', () => ({
  useTranslatedMicroRegions: vi.fn(() => ({
    translateMicroRegion: vi.fn((t) => t),
  })),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

afterEach(() => {
  vi.restoreAllMocks();
});

const onSuccess = vi.fn();
const onError = vi.fn();

describe('useVolume', () => {
  it('returns volume data when volumeId is provided', async () => {
    const volumeMock: TVolume = {
      id: '1',
      name: 'Volume 1',
      attachedTo: [],
      creationDate: '',
      description: '',
      size: 0,
      status: '',
      statusGroup: '',
      region: '',
      bootable: false,
      planCode: '',
      type: '',
      regionName: '',
    };

    vi.mocked(getVolume).mockResolvedValue(volumeMock);

    const { result } = renderHook(() => useVolume('123', '1'), {
      wrapper,
    });

    await waitFor(() => {
      expect(getVolume).toHaveBeenCalledWith('123', '1');
      expect(result.current.data).toEqual(volumeMock);
    });
  });

  it('does not fetch data when volumeId is not provided', () => {
    const { result } = renderHook(() => useVolume('123', null), { wrapper });

    expect(getVolume).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });
});

describe('useVolumes', () => {
  it('returns volumes data when projectId is provided', async () => {
    const volumesMock: TVolume[] = [
      {
        id: '1',
        name: 'Volume 1',
        attachedTo: [],
        creationDate: '',
        description: '',
        size: 0,
        status: 'available',
        statusGroup: '',
        region: 'region',
        bootable: false,
        planCode: '',
        type: '',
        regionName: '',
      },
      {
        id: '2',
        name: 'Volume 2',
        attachedTo: [],
        creationDate: '',
        description: '',
        size: 0,
        status: 'available',
        statusGroup: '',
        region: 'region',
        bootable: false,
        planCode: '',
        type: '',
        regionName: '',
      },
    ];

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
      expect(result.current.data).toEqual({
        pageCount: 1,
        rows: [
          {
            attachedTo: [],
            bootable: false,
            creationDate: '',
            description: '',
            id: '1',
            name: 'Volume 1',
            planCode: '',
            region: 'region',
            regionName: 'region',
            size: 0,
            status: 'available',
            statusGroup: 'ACTIVE',
            type: '',
          },
          {
            attachedTo: [],
            bootable: false,
            creationDate: '',
            description: '',
            id: '2',
            name: 'Volume 2',
            planCode: '',
            region: 'region',
            regionName: 'region',
            size: 0,
            status: 'available',
            statusGroup: 'ACTIVE',
            type: '',
          },
        ],
        totalRows: 2,
      });
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
      statusGroup: '',
      region: 'region',
      bootable: false,
      planCode: '',
      type: '',
      regionName: '',
    });

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
      statusGroup: '',
      region: 'region',
      bootable: false,
      planCode: '',
      type: '',
      regionName: '',
    });

    const { result } = renderHook(
      () =>
        useDetachVolume({
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
      expect(detachVolume).toHaveBeenCalledWith('123', '1', '1');
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
