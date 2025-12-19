import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as suggestionApi from '@/data/api/ai/notebook/quantumSuggestions.api';
import { mockedSuggestionsForNotebook } from '@/__tests__/helpers/mocks/suggestion';
import { useGetQuantumSuggestions } from './useGetQuantumSuggestions.hook';

vi.mock('@/data/api/ai/notebook/quantumSuggestions.api', () => ({
  getQuantumSuggestions: vi.fn(),
}));

describe('useGetQuantumSuggestions', () => {
  it('should return Quantum Suggestions', async () => {
    const projectId = 'projectId';

    const mockedGetQuantumSuggestions = (suggestionApi.getQuantumSuggestions as unknown) as ReturnType<
      typeof vi.fn
    >;

    mockedGetQuantumSuggestions.mockResolvedValue(mockedSuggestionsForNotebook);

    const { result } = renderHook(
      () => useGetQuantumSuggestions(projectId, 'qpu'),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockedSuggestionsForNotebook);
    expect(suggestionApi.getQuantumSuggestions).toHaveBeenCalledWith(
      { projectId },
      'qpu',
    );
  });
});
