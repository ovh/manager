import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TQuota } from '@ovh-ux/manager-pci-common';

import { getProjectQuotaByRegion } from '@/api/data/quota';
import { wrapper } from '@/wrapperRenders';

import { useProjectQuotaByRegion } from './useProjectQuota';

vi.mock('@/api/data/quota', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/data/quota')>();
  return {
    ...actual,
    getProjectQuotaByRegion: vi.fn(),
  };
});

describe('useProjectQuotaByRegion', () => {
  const projectId = 'project1';
  const regionName = 'GRA';
  const mockQuota = {
    region: regionName,
    instance: { maxInstances: 10 },
  } as TQuota;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns quota data on success', async () => {
    vi.mocked(getProjectQuotaByRegion).mockResolvedValue(mockQuota);

    const { result } = renderHook(() => useProjectQuotaByRegion(projectId, regionName), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(getProjectQuotaByRegion).toHaveBeenCalledWith(projectId, regionName);
    expect(result.current.data).toEqual(mockQuota);
  });

  it('handles error when API fails', async () => {
    vi.mocked(getProjectQuotaByRegion).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useProjectQuotaByRegion(projectId, regionName), {
      wrapper,
    });

    await waitFor(() => result.current.isError);

    expect(result.current.error).toBeNull();
  });

  it('applies select function when provided', async () => {
    vi.mocked(getProjectQuotaByRegion).mockResolvedValue(mockQuota);

    const select = vi.fn((data) => ({ ...data, test: true }));

    const { result } = renderHook(
      () => useProjectQuotaByRegion(projectId, regionName, { select }),
      { wrapper },
    );

    await waitFor(() => result.current.isSuccess);

    expect(select).toHaveBeenCalledWith(mockQuota);
    expect(result.current.data).toHaveProperty('test', true);
  });
});
