import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as appApi from '@/data/api/apiApp';
import { useGetApps } from '@/hooks/api/apiApp/useGetApps';
import { mockedApp } from '@/__tests__/helpers/mocks/app';

vi.mock('@/data/api/apiApp', () => ({
  getApps: vi.fn(),
}));

describe('useGetApps', () => {
  it('should return Apps', async () => {
    const projectId = 'projectId';

    vi.mocked(appApi.getApps).mockResolvedValue([mockedApp]);

    const { result } = renderHook(() => useGetApps(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedApp]);
      expect(appApi.getApps).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});