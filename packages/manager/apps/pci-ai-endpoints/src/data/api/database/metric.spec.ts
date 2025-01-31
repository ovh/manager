import { v6 } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getMetrics, getMetric } from '@/data/api/database/metric.api';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn().mockReturnValue({ data: {} }),
  },
}));

describe('metrics functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getMetrics', async () => {
    expect(v6.get).not.toHaveBeenCalled();

    await getMetrics({
      projectId: 'projectId',
      startTime: '2024-01-01T00:00:00Z',
      endTime: '2024-01-02T00:00:00Z',
    });

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/projectId/ai/endpoints/metrics?startTime=2024-01-01T00:00:00Z&endTime=2024-01-02T00:00:00Z`,
    );
  });

  it('should call getMetric', async () => {
    expect(v6.get).not.toHaveBeenCalled();

    await getMetric({
      projectId: 'projectId',
      metric: 'llama-3-1-70b-instruct',
      startTime: '2024-01-01T00:00:00Z',
      endTime: '2024-01-02T00:00:00Z',
    });

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/projectId/ai/endpoints/metrics/llama-3-1-70b-instruct?startTime=2024-01-01T00:00:00Z&endTime=2024-01-02T00:00:00Z`,
    );
  });
});
