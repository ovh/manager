import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { NotebookData } from '@/data/api';
import { useRestartNotebook } from './useRestartNotebook.hook';

vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
  restartNotebook: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: 'projectId' }),
}));

describe('useRestartNotebook', () => {
  it('should restart a Notebook', async () => {
    const projectId = 'projectId';
    const notebookId = 'notebookId';

    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useRestartNotebook({ onError, onSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const restartNotebookProps: NotebookData = {
      projectId,
      notebookId,
    };

    result.current.restartNotebook(restartNotebookProps);

    await waitFor(() => {
      expect(notebookApi.restartNotebook).toHaveBeenCalledWith(
        restartNotebookProps,
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
