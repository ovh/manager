import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/capabilities.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

import { mockedCapabilities } from '@/__tests__/helpers/mocks/availabilities';
import { useGetCapabilities } from './useGetCapabilities.hook';

vi.mock('@/data/api/database/capabilities.api', () => ({
  getCapabilities: vi.fn(),
}));

describe('useGetCapabilities', () => {
  it('should return Capabilities', async () => {
    const projectId = 'projectId';

    vi.mocked(databaseAPI.getCapabilities).mockResolvedValue(
      mockedCapabilities,
    );

    const { result } = renderHook(() => useGetCapabilities(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedCapabilities);
      expect(databaseAPI.getCapabilities).toHaveBeenCalledWith(projectId);
    });
  });
});
