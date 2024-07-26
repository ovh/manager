import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/queries.api';
import * as database from '@/types/cloud/project/database';
import { useCancelCurrentQuery } from './useCancelCurrentQuery.hook';
import { useResetQueryStatistics } from './useResetQueryStatistics.hook';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

vi.mock('@/data/api/database/queries.api', () => ({
  getCurrentQueries: vi.fn(),
  cancelCurrentQuery: vi.fn(),
  getQueryStatistics: vi.fn(),
  resetQueryStatistics: vi.fn(),
}));

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
