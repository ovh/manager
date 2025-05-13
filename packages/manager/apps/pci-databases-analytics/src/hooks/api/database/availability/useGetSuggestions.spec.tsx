import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/availability.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

import { mockedSuggestions } from '@/__tests__/helpers/mocks/availabilities';
import { useGetSuggestions } from './useGetSuggestions.hook';

vi.mock('@/data/api/database/availability.api', () => ({
  getSuggestions: vi.fn(),
}));

describe('useGetSuggestions', () => {
  it('should return Suggestions', async () => {
    const projectId = 'projectId';

    vi.mocked(databaseAPI.getSuggestions).mockResolvedValue([
      mockedSuggestions,
    ]);

    const { result } = renderHook(() => useGetSuggestions(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedSuggestions]);
      expect(databaseAPI.getSuggestions).toHaveBeenCalledWith(projectId);
    });
  });
});
