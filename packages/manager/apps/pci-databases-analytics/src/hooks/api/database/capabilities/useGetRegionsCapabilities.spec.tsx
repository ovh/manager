import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/capabilities.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

import { mockedRegionCapabilities } from '@/__tests__/helpers/mocks/availabilities';
import { useGetRegionsCapabilities } from './useGetRegionsCapabilities.hook';

vi.mock('@/data/api/database/capabilities.api', () => ({
  getRegionsCapabilities: vi.fn(),
}));

describe('useGetRegionsCapabilities', () => {
  it('should return RegionsCapabilities', async () => {
    const projectId = 'projectId';

    vi.mocked(databaseAPI.getRegionsCapabilities).mockResolvedValue([
      mockedRegionCapabilities,
    ]);

    const { result } = renderHook(() => useGetRegionsCapabilities(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedRegionCapabilities]);
      expect(databaseAPI.getRegionsCapabilities).toHaveBeenCalledWith(
        projectId,
      );
    });
  });
});
