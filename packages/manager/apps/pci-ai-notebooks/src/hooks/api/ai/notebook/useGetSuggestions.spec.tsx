import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as suggestionApi from '@/data/api/ai/notebook/suggestions.api';
import { useGetSuggestions } from './useGetSuggestions.hook';
import { mockedNotebookSuggestion } from '@/__tests__/helpers/mocks/suggestion';

vi.mock('@/data/api/ai/notebook/suggestions.api', () => ({
  getSuggestions: vi.fn(),
}));

describe('useGetSuggestions', () => {
  it('should return Suggestions', async () => {
    const projectId = 'projectId';

    vi.mocked(suggestionApi.getSuggestions).mockResolvedValue(
      mockedNotebookSuggestion,
    );

    const { result } = renderHook(() => useGetSuggestions(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedNotebookSuggestion);
      expect(suggestionApi.getSuggestions).toHaveBeenCalledWith();
    });
  });
});
