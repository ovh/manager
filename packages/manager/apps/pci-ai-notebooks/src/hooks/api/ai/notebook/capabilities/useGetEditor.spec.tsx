import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as editorApi from '@/data/api/ai/notebook/capabilities/editor.api';
import { useGetEditor } from './useGetEditor.hook';
import { mockedEditor } from '@/__tests__/helpers/mocks/notebook/editor';

vi.mock('@/data/api/ai/notebook/capabilities/editor.api', () => ({
  getEditor: vi.fn(),
}));

describe('useGetEditor', () => {
  it('should return Editor', async () => {
    const projectId = 'projectId';

    vi.mocked(editorApi.getEditor).mockResolvedValue([mockedEditor]);

    const { result } = renderHook(() => useGetEditor(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedEditor]);
      expect(editorApi.getEditor).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
