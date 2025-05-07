import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { NotebookData } from '@/data/api';
import { useStopNotebook } from './useStopNotebook.hook';

vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
  stopNotebook: vi.fn(),
}));

describe('useStopNotebook', () => {
  it('should stop a Notebook', async () => {
    const projectId = 'projectId';
    const notebookId = 'notebookId';
    const onStopSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(notebookApi.stopNotebook).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useStopNotebook({ onError, onStopSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const stopNotebookProps: NotebookData = {
      projectId,
      notebookId,
    };

    result.current.stopNotebook(stopNotebookProps);

    await waitFor(() => {
      expect(notebookApi.stopNotebook).toHaveBeenCalledWith(stopNotebookProps);
      expect(onStopSuccess).toHaveBeenCalledWith();
    });
  });
});
