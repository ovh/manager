import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { useGetCommand } from './useGetCommand.hook';
import { mockedNotebookSpecInput } from '@/__tests__/helpers/mocks/notebook/notebook';
import { AddNotebook } from '@/data/api/ai/notebook/notebook.api';
import { mockedCommand } from '@/__tests__/helpers/mocks/shared/command';

vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
  getCommand: vi.fn(),
}));

describe('useGetCommand', () => {
  it('should return CLI Command', async () => {
    const projectId = 'projectId';

    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(notebookApi.getCommand).mockResolvedValue(mockedCommand);
    const { result } = renderHook(() => useGetCommand({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const addNotebookProps: AddNotebook = {
      projectId,
      notebookInfo: mockedNotebookSpecInput,
    };
    result.current.getCommand(addNotebookProps);

    await waitFor(() => {
      expect(notebookApi.getCommand).toHaveBeenCalledWith(addNotebookProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedCommand,
        addNotebookProps,
        undefined,
      );
    });
  });
});
