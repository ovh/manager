import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as suggestionApi from '@/data/api/ai/notebook/suggestions.api';
import { mockedSuggestion } from '@/__tests__/helpers/mocks/suggestion';
import { useGetSuggestions } from './useGetSuggestions.hook';

vi.mock('@/data/api/ai/notebook/suggestions.api', () => ({
  getSuggestions: vi.fn(),
}));

describe('useGetSuggestions', () => {
  it('should return Suggestions', async () => {
    const projectId = 'projectId';

    vi.mocked(suggestionApi.getSuggestions).mockResolvedValue(mockedSuggestion);

    const { result } = renderHook(() => useGetSuggestions(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedSuggestion);
      expect(suggestionApi.getSuggestions).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
