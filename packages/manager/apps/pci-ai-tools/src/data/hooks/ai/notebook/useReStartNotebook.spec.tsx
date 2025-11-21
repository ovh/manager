import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { useReStartNotebook } from './useReStartNotebook.hook';
import { NotebookData } from '@/data/api';

vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
  reStartNotebook: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: 'projectId' }),
}));

describe('useReStartNotebook', () => {
  it('should restart a Notebook', async () => {
    const projectId = 'projectId';
    const notebookId = 'notebookId';

    const onReStartSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(notebookApi.reStartNotebook).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useReStartNotebook({ onError, onReStartSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const restartNotebookProps: NotebookData = {
      projectId,
      notebookId,
    };

    result.current.reStartNotebook(restartNotebookProps);

    await waitFor(() => {
      expect(notebookApi.reStartNotebook).toHaveBeenCalledWith(
        restartNotebookProps,
      );
      expect(onReStartSuccess).toHaveBeenCalled();
    });
  });
});
