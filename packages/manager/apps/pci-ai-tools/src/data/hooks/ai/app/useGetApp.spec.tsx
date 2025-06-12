import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as appApi from '@/data/api/ai/app/app.api';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';
import { useGetApp } from './useGetApp.hook';

vi.mock('@/data/api/ai/app/app.api', () => ({
  getApp: vi.fn(),
}));

describe('useGetApp', () => {
  it('should return App', async () => {
    const projectId = 'projectId';
    const appId = 'appId';

    vi.mocked(appApi.getApp).mockResolvedValue(mockedApp);

    const { result } = renderHook(() => useGetApp(projectId, appId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedApp);
      expect(appApi.getApp).toHaveBeenCalledWith({
        projectId,
        appId,
      });
    });
  });
});
