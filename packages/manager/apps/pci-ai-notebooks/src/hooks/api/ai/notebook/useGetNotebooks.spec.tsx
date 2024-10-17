import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook';
import { useGetNotebooks } from './useGetNotebooks.hook';

vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
  getNotebooks: vi.fn(),
}));

describe('useGetJobs', () => {
  it('should return Jobs', async () => {
    const projectId = 'projectId';

    vi.mocked(notebookApi.getNotebooks).mockResolvedValue([mockedNotebook]);

    const { result } = renderHook(() => useGetNotebooks(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedNotebook]);
      expect(notebookApi.getNotebooks).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
