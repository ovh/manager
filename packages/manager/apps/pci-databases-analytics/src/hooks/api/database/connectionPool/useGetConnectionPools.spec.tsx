import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/connectionPool.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedConnectionPool } from '@/__tests__/helpers/mocks/connectionPool';
import { useGetConnectionPools } from './useGetConnectionPools.hook';

vi.mock('@/data/api/database/connectionPool.api', () => ({
  getConnectionPools: vi.fn(),
}));

describe('useGetConnectionPool', () => {
  it('should return connectionPool data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getConnectionPools).mockResolvedValue([
      mockedConnectionPool,
    ]);

    const { result } = renderHook(
      () => useGetConnectionPools(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedConnectionPool]);
      expect(databaseAPI.getConnectionPools).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
