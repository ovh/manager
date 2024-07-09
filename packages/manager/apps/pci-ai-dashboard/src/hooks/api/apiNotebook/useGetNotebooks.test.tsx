import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as notebookApi from '@/data/api/apiNotebook';
import { useGetNotebooks } from '@/hooks/api/apiNotebook/useGetNotebooks';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook';

vi.mock('@/data/api/apiNotebook', () => ({
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