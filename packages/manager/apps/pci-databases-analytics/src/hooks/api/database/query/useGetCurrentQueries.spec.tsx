import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/queries.api';
import * as database from '@/types/cloud/project/database';
import { useGetCurrentQueries } from '@/hooks/api/database/query/useGetCurrentQueries.hook';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedQueries } from '@/__tests__/helpers/mocks/queries';

vi.mock('@/data/api/database/queries.api', () => ({
  getCurrentQueries: vi.fn(),
  cancelCurrentQuery: vi.fn(),
  getQueryStatistics: vi.fn(),
  resetQueryStatistics: vi.fn(),
}));

describe('useGetCurrentQueries', () => {
  it('should return currentQuery data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getCurrentQueries).mockResolvedValue([mockedQueries]);

    const { result } = renderHook(
      () => useGetCurrentQueries(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedQueries]);
      expect(databaseAPI.getCurrentQueries).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
