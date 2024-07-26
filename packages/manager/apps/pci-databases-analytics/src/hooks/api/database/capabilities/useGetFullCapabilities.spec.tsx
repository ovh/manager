import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/capabilities.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

import {
  mockedCapabilities,
  mockedEngineCapabilities,
  mockedFullCapabilities,
  mockedRegionCapabilities,
} from '@/__tests__/helpers/mocks/availabilities';
import { useGetFullCapabilities } from './useGetFullCapabilities.hook';

vi.mock('@/data/api/database/capabilities.api', () => ({
  getCapabilities: vi.fn(),
  getEnginesCapabilities: vi.fn(),
  getRegionsCapabilities: vi.fn(),
}));

describe('useGetFullCapabilities', () => {
  it('should return FullCapabilities', async () => {
    const projectId = 'projectId';

    vi.mocked(databaseAPI.getCapabilities).mockResolvedValue(
      mockedCapabilities,
    );

    vi.mocked(databaseAPI.getEnginesCapabilities).mockResolvedValue([
      mockedEngineCapabilities,
    ]);

    vi.mocked(databaseAPI.getRegionsCapabilities).mockResolvedValue([
      mockedRegionCapabilities,
    ]);

    const { result } = renderHook(() => useGetFullCapabilities(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedFullCapabilities);
      expect(databaseAPI.getRegionsCapabilities).toHaveBeenCalledWith(
        projectId,
      );
    });
  });
});
