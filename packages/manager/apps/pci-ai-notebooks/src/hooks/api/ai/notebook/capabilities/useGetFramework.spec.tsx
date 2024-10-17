import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as frameworkApi from '@/data/api/ai/notebook/capabilities/framework.api';
import { useGetFramework } from './useGetFramework.hook';
import { mockedFramework } from '@/__tests__/helpers/mocks/notebook/framework';

vi.mock('@/data/api/ai/notebook/capabilities/framework.api', () => ({
  getFramework: vi.fn(),
}));

describe('useGetFramework', () => {
  it('should return Framework', async () => {
    const projectId = 'projectId';

    vi.mocked(frameworkApi.getFramework).mockResolvedValue([mockedFramework]);

    const { result } = renderHook(() => useGetFramework(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedFramework]);
      expect(frameworkApi.getFramework).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
