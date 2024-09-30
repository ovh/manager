import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/queries.api';
import * as database from '@/types/cloud/project/database';
import { useGetQueryStatistics } from './useGetQueryStatistics.hook';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedQueryStatistics } from '@/__tests__/helpers/mocks/queries';

vi.mock('@/data/api/database/queries.api', () => ({
  getCurrentQueries: vi.fn(),
  cancelCurrentQuery: vi.fn(),
  getQueryStatistics: vi.fn(),
  resetQueryStatistics: vi.fn(),
}));

describe('useGetQueryStatistics', () => {
  it('should return QueryStatistics data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getQueryStatistics).mockResolvedValue([
      mockedQueryStatistics,
    ]);

    const { result } = renderHook(
      () => useGetQueryStatistics(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedQueryStatistics]);
      expect(databaseAPI.getQueryStatistics).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
