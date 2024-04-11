import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/api/databases/queries';
import { database } from '@/models/database';
import {
  useGetQueryStatistics,
  useGetCurrentQueries,
  useCancelCurrentQuery,
  useResetQueryStatistics,
} from '@/hooks/api/queries.api.hooks';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedQueries,
  mockedQueryStatistics,
} from '@/__tests__/helpers/mocks/queries';

vi.mock('@/api/databases/queries', () => ({
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

describe('useCancelCurrentQuery', () => {
  it('should call useCancelCurrentQuery on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const pid = 1;
    const terminate = true;
    const mockCancelResponse = { success: true };
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.cancelCurrentQuery).mockResolvedValue(
      mockCancelResponse,
    );
    const { result } = renderHook(
      () => useCancelCurrentQuery({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const cancelCurrentQueryProps = {
      projectId,
      engine,
      serviceId,
      pid,
      terminate,
    };
    result.current.cancelCurrentQuery(cancelCurrentQueryProps);

    await waitFor(() => {
      expect(databaseAPI.cancelCurrentQuery).toHaveBeenCalledWith(
        cancelCurrentQueryProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockCancelResponse,
        cancelCurrentQueryProps,
        undefined,
      );
    });
  });
});

describe('useResetQueryStatistics', () => {
  it('should call useResetQueryStatistics on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.resetQueryStatistics).mockResolvedValue(undefined);
    const { result } = renderHook(
      () => useResetQueryStatistics({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const resetQueryStatisticsProps = {
      projectId,
      engine,
      serviceId,
    };
    result.current.resetQueryStatistics(resetQueryStatisticsProps);

    await waitFor(() => {
      expect(databaseAPI.resetQueryStatistics).toHaveBeenCalledWith(
        resetQueryStatisticsProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        undefined,
        resetQueryStatisticsProps,
        undefined,
      );
    });
  });
});
