import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as regionAPI from '@/data/api/region/region.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedRegion } from '@/__tests__/helpers/mocks/region/region';
import { useGetRegions } from './useGetRegions.hook';

vi.mock('@/data/api/region/region.api', () => ({
  getRegions: vi.fn(),
}));

describe('useGetRegions', () => {
  it('should return service regions', async () => {
    const projectId = 'projectId';

    vi.mocked(regionAPI.getRegions).mockResolvedValue([mockedRegion]);

    const { result } = renderHook(() => useGetRegions(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedRegion]);
      expect(regionAPI.getRegions).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
