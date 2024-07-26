import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/database.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedDatabase } from '@/__tests__/helpers/mocks/databases';
import { useGetDatabases } from './useGetDatabases.hook';

vi.mock('@/data/api/database/database.api', () => ({
  getServiceDatabases: vi.fn(),
  addDatabase: vi.fn(),
  deleteDatabase: vi.fn(),
}));

describe('useGetDatabases', () => {
  it('should return service databases data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getServiceDatabases).mockResolvedValue([
      mockedDatabase,
    ]);

    const { result } = renderHook(
      () => useGetDatabases(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedDatabase]);
      expect(databaseAPI.getServiceDatabases).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
