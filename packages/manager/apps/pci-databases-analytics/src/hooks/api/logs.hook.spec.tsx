import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useGetServiceLogs } from '@/hooks/api/logs.api.hooks';

import * as databaseAPI from '@/api/databases/logs';
import { database } from '@/models/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedLogs } from '@/__tests__/helpers/mocks/logs';

vi.mock('@/api/databases/logs', () => ({
  getServiceLogs: vi.fn(),
}));

describe('useGetServiceLogs', () => {
  it('should return service Logs', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getServiceLogs).mockResolvedValue([mockedLogs]);

    const { result } = renderHook(
      () => useGetServiceLogs(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedLogs]);
      expect(databaseAPI.getServiceLogs).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
