import { vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetRegion } from './useRegion';
import { getRegion, TRegion } from '@/api/data/region';
import { wrapper } from '@/wrapperRenders';

vi.mock('@/api/data/region');

describe('useGetRegion', () => {
  it('should fetch region data successfully', async () => {
    const projectId = 'test-project';
    const region = 'test-region';
    const mockRegionData = ({
      id: region,
      name: 'Test Region',
      status: 'UP',
      services: [],
    } as unknown) as TRegion;

    vi.mocked(getRegion).mockResolvedValueOnce(mockRegionData);

    const { result } = renderHook(() => useGetRegion(projectId, region), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockRegionData);
    expect(getRegion).toHaveBeenCalledWith(projectId, region);
  });

  it('should handle error while fetching region data', async () => {
    const projectId = 'test-project';
    const region = 'test-region';
    const mockError = new Error('Failed to fetch region data');

    vi.mocked(getRegion).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGetRegion(projectId, region), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(getRegion).toHaveBeenCalledWith(projectId, region);
  });
});
