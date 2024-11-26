import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import {
  mockedNotebook,
  mockedNotebookSpec,
} from '@/__tests__/helpers/mocks/notebook';
import { useAddNotebook } from './useAddNotebook.hook';

vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
  addNotebook: vi.fn(),
}));

describe('useAddNotebooks', () => {
  it('should create a Notebook', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(notebookApi.addNotebook).mockResolvedValue(mockedNotebook);

    const { result } = renderHook(
      () => useAddNotebook({ onError, onSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.addNotebook(mockedNotebookSpec);

    await waitFor(() => {
      expect(notebookApi.addNotebook).toHaveBeenCalledWith({
        projectId: undefined,
        notebookInfo: mockedNotebookSpec,
      });
      expect(onSuccess).toHaveBeenCalledWith(mockedNotebook);
    });
  });
});
