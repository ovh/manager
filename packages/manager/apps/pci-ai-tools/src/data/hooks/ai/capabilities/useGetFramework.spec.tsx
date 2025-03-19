import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as capabilitiesApi from '@/data/api/ai/capabilities/capabilities.api';
import { useGetFramework } from './useGetFramework.hook';
import { mockedFramework } from '@/__tests__/helpers/mocks/capabilities/notebookFramework';

vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
  getFramework: vi.fn(),
}));

describe('useGetFramework', () => {
  it('should return Framework', async () => {
    const projectId = 'projectId';
    const region = 'region';

    vi.mocked(capabilitiesApi.getFramework).mockResolvedValue([
      mockedFramework,
    ]);

    const { result } = renderHook(() => useGetFramework(projectId, region), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedFramework]);
      expect(capabilitiesApi.getFramework).toHaveBeenCalledWith({
        projectId,
        region,
      });
    });
  });
});
