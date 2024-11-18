import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { useDeleteNotebook } from './useDeleteNotebook.hook';

vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
  deleteNotebook: vi.fn(),
}));

describe('useDeleteNotebooks', () => {
  it('should delete a Notebook', async () => {
    const projectId = 'projectId';
    const notebookId = 'notebookId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(notebookApi.deleteNotebook).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteNotebook({ onError, onSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const deleteNotebookProps = {
      projectId,
      notebookId,
    };
    result.current.deleteNotebook(deleteNotebookProps);

    await waitFor(() => {
      expect(notebookApi.deleteNotebook).toHaveBeenCalledWith(
        deleteNotebookProps,
      );
    });
  });
});
