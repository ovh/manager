import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useGetServiceLogs } from '@/hooks/api/database/logs/useGetServiceLogs.hook';

import * as databaseAPI from '@/data/api/database/logs.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedLogs } from '@/__tests__/helpers/mocks/logs';

vi.mock('@/data/api/database/logs.api', () => ({
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
