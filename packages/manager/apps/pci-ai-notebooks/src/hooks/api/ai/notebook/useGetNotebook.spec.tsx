import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook';
import { useGetNotebook } from './useGetNotebook.hook';

vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
  getNotebook: vi.fn(),
}));

describe('useGetNotebook', () => {
  it('should return Notebook', async () => {
    const projectId = 'projectId';
    const notebookId = 'notebookId';

    vi.mocked(notebookApi.getNotebook).mockResolvedValue(mockedNotebook);

    const { result } = renderHook(() => useGetNotebook(projectId, notebookId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedNotebook);
      expect(notebookApi.getNotebook).toHaveBeenCalledWith({
        projectId,
        notebookId,
      });
    });
  });
});
