import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as suggestionApi from '@/data/api/ai/job/suggestions.api';
import { mockedTempJobSuggestionForOrderFunnel } from '@/__tests__/helpers/mocks/suggestion';
import { useGetSuggestions } from './useGetSuggestionsJobs.hook';

vi.mock('@/data/api/ai/job/suggestions.api', () => ({
  getSuggestions: vi.fn(),
}));

describe('useGetSuggestions', () => {
  it('should return Suggestions', async () => {
    const projectId = 'projectId';

    vi.mocked(suggestionApi.getSuggestions).mockResolvedValue(
      mockedTempJobSuggestionForOrderFunnel,
    );

    const { result } = renderHook(() => useGetSuggestions(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(
        mockedTempJobSuggestionForOrderFunnel,
      );
      expect(suggestionApi.getSuggestions).toHaveBeenCalledWith();
    });
  });
});
