import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useGetMetrics, useGetMetric } from '@/hooks/api/metrics.api.hooks';
import * as databaseAPI from '@/api/databases/metrics';
import { database } from '@/models/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockMetric } from '@/__tests__/helpers/mocks/metrics';

vi.mock('@/api/databases/metrics', () => ({
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

describe('useGetMetric', () => {
  it('should return service Metric', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const metric = 'metric';
    const period = database.service.MetricPeriodEnum.lastDay;
    vi.mocked(databaseAPI.getMetric).mockResolvedValue(mockMetric);

    const { result } = renderHook(
      () => useGetMetric(projectId, engine, serviceId, metric, period),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockMetric);
      expect(databaseAPI.getMetric).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
        metric,
        period,
      });
    });
  });
});
