import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { useStartNotebook } from './useStartNotebook.hook';
import { NotebookData } from '@/data/api';

vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
  startNotebook: vi.fn(),
}));

describe('useStartNotebook', () => {
  it('should start a Notebook', async () => {
    const projectId = 'projectId';
    const notebookId = 'notebookId';
    const onStartSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(notebookApi.startNotebook).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useStartNotebook({ onError, onStartSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const startNotebookProps: NotebookData = {
      projectId,
      notebookId,
    };

    result.current.startNotebook(startNotebookProps);

    await waitFor(() => {
      expect(notebookApi.startNotebook).toHaveBeenCalledWith(
        startNotebookProps,
      );
      expect(onStartSuccess).toHaveBeenCalledWith();
    });
  });
});
