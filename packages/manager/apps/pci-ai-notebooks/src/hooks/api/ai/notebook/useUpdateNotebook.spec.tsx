import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';

import { useUpdateNotebook } from './useUpdateNotebook.hook';
import { UpdateNotebook } from '@/data/api/ai/notebook/notebook.api';
import {
  mockedNotebook,
  mockedNotebookUpdateInput,
} from '@/__tests__/helpers/mocks/notebook/notebook';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
  updateNotebook: vi.fn(),
}));

describe('useUpdateNotebook', () => {
  it('should update an Notebook', async () => {
    const projectId = 'projectId';
    const notebookId = 'notebookId';
    const onUpdateSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(notebookApi.updateNotebook).mockResolvedValue(mockedNotebook);

    const { result } = renderHook(
      () => useUpdateNotebook({ onError, onUpdateSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const updateDataProps: UpdateNotebook = {
      projectId,
      notebookId,
      notebookInfo: mockedNotebookUpdateInput,
    };

    result.current.updateNotebook(updateDataProps);

    await waitFor(() => {
      expect(notebookApi.updateNotebook).toHaveBeenCalledWith(updateDataProps);
      expect(onUpdateSuccess).toHaveBeenCalledWith(mockedNotebook);
    });
  });
});
