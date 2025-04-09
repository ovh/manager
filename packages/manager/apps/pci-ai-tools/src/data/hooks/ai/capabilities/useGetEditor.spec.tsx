import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as capabilitiesApi from '@/data/api/ai/capabilities/capabilities.api';
import { mockedEditor } from '@/__tests__/helpers/mocks/capabilities/notebookEditor';
import { useGetEditor } from './useGetEditor.hook';

vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
  getEditor: vi.fn(),
}));

describe('useGetEditor', () => {
  it('should return Editor', async () => {
    const projectId = 'projectId';
    const region = 'region';

    vi.mocked(capabilitiesApi.getEditor).mockResolvedValue([mockedEditor]);

    const { result } = renderHook(() => useGetEditor(projectId, region), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedEditor]);
      expect(capabilitiesApi.getEditor).toHaveBeenCalledWith({
        projectId,
        region,
      });
    });
  });
});
