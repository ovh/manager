import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as appApi from '@/data/api/ai/app/logs/logs.api';
import { mockedLogs } from '@/__tests__/helpers/mocks/shared/logs';
import { useGetLogs } from './useGetLogs.hook';

vi.mock('@/data/api/ai/app/logs/logs.api', () => ({
  getLogs: vi.fn(),
}));

describe('useGetLogs', () => {
  it('should return Logs', async () => {
    const projectId = 'projectId';
    const appId = 'appId';

    vi.mocked(appApi.getLogs).mockResolvedValue(mockedLogs);

    const { result } = renderHook(() => useGetLogs(projectId, appId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedLogs);
      expect(appApi.getLogs).toHaveBeenCalledWith({
        projectId,
        appId,
      });
    });
  });
});
