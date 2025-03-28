import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { getInstancesByRegion, TInstance } from '@ovh-ux/manager-pci-common';
import { useAttachableInstances } from '@/api/hooks/useInstance';
import { getVolume, TVolume } from '@/api/data/volume';

vi.mock('@ovh-ux/manager-pci-common');
vi.mock('@/api/data/volume');

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockInstances = [
  {
    id: '1',
    name: 'Instance 1',
    region: 'region1',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Instance 2',
    region: 'region1',
    status: 'SHELVING',
  },
  {
    id: '4',
    name: 'Instance 4',
    region: 'region2',
    status: 'ACTIVE',
    availabilityZone: 'region2-a',
  },
  {
    id: '5',
    name: 'Instance 5',
    region: 'region2',
    status: 'SHELVING',
    availabilityZone: 'region2-b',
  },
] as TInstance[];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useAttachableInstances', () => {
  beforeEach(() => {
    vi.mocked(getInstancesByRegion).mockImplementation((_projectId, region) =>
      Promise.resolve(mockInstances.filter((i) => i.region === region)),
    );
  });

  it('returns instances data when volumeId is provided', async () => {
    vi.mocked(getVolume).mockResolvedValue({
      region: 'region1',
    } as TVolume);

    const { result } = renderHook(
      () => useAttachableInstances('123', 'volume1'),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(getInstancesByRegion).toHaveBeenCalledWith('123', 'region1');
      expect(result.current.data).toHaveLength(1);
    });
  });

  it('does not fetch data when volume is not provided', () => {
    vi.mocked(getVolume).mockRejectedValue('no volume');

    const { result } = renderHook(() => useAttachableInstances('123', null), {
      wrapper,
    });

    expect(getInstancesByRegion).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });

  it('returns active instances', async () => {
    vi.mocked(getVolume).mockResolvedValue({
      region: 'region1',
    } as TVolume);
    const { result } = renderHook(
      () => useAttachableInstances('123', 'volume1'),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual([
        expect.objectContaining({
          id: '1',
        }),
      ]);
    });
  });

  it('returns instances when availability zone is any', async () => {
    vi.mocked(getVolume).mockResolvedValue({
      region: 'region2',
      availabilityZone: 'any',
    } as TVolume);
    const { result } = renderHook(
      () => useAttachableInstances('123', 'volume1'),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual([
        expect.objectContaining({
          id: '4',
        }),
      ]);
    });
  });

  it('returns instances with same availability zone', async () => {
    vi.mocked(getVolume).mockResolvedValue({
      region: 'region2',
      availabilityZone: 'region2-a',
    } as TVolume);
    const { result } = renderHook(
      () => useAttachableInstances('123', 'volume1'),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual([
        expect.objectContaining({
          id: '4',
        }),
      ]);
    });
  });
});
