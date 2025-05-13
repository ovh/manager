import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/metric.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockMetric } from '@/__tests__/helpers/mocks/metrics';
import { useGetMetric } from './useGetMetric.hook';

vi.mock('@/data/api/database/metric.api', () => ({
  getMetrics: vi.fn(),
  getMetric: vi.fn(),
}));

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
