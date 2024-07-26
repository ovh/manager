import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/metric.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useGetMetrics } from './useGetMetrics.hook';

vi.mock('@/data/api/database/metric.api', () => ({
  getMetrics: vi.fn(),
  getMetric: vi.fn(),
}));

describe('useGetMetrics', () => {
  it('should return service Metrics', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getMetrics).mockResolvedValue(['metric1', 'metric2']);

    const { result } = renderHook(
      () => useGetMetrics(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(['metric1', 'metric2']);
      expect(databaseAPI.getMetrics).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
