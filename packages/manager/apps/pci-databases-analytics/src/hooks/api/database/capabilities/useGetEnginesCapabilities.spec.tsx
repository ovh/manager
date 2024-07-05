import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/capabilities.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

import { mockedEngineCapabilities } from '@/__tests__/helpers/mocks/availabilities';
import { useGetEnginesCapabilities } from './useGetEnginesCapabilities.hook';

vi.mock('@/data/api/database/capabilities.api', () => ({
  getEnginesCapabilities: vi.fn(),
}));

describe('useGetEnginesCapabilities', () => {
  it('should return EnginesCapabilities', async () => {
    const projectId = 'projectId';

    vi.mocked(databaseAPI.getEnginesCapabilities).mockResolvedValue([
      mockedEngineCapabilities,
    ]);

    const { result } = renderHook(() => useGetEnginesCapabilities(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedEngineCapabilities]);
      expect(databaseAPI.getEnginesCapabilities).toHaveBeenCalledWith(
        projectId,
      );
    });
  });
});
