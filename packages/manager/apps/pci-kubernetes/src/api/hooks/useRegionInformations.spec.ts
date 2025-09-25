import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import * as ApiRegionModule from '@/api/data/informations-region';
import { TRegionInformations } from '@/types/region';
import { wrapper } from '@/wrapperRenders';

import { useRegionInformations } from './useRegionInformations';

describe('useRegionInformations', () => {
  it('fetches region information successfully', async () => {
    const mockData = {
      name: 'region1',
      status: 'UP',
    } as unknown as TRegionInformations;
    vi.spyOn(ApiRegionModule, 'getRegionInformations').mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useRegionInformations('project1', 'region1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('handles error when fetching region information', async () => {
    vi.spyOn(ApiRegionModule, 'getRegionInformations').mockRejectedValueOnce(
      new Error('Network Error'),
    );

    const { result } = renderHook(() => useRegionInformations('project1', 'region1'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error('Network Error'));
  });
});
