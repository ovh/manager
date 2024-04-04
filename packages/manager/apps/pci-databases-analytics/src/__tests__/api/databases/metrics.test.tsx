import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getMetrics, getMetric } from '../../../api/databases/metrics';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        get,
      },
    },
  };
});

describe('metrics service functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getMetrics', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getMetrics({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/metric?extended=false',
    );
  });

  it('should call getMetric', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getMetric({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
      metric: 'metricName',
      period: 'hour', // provide a valid period value
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/metric/metricName?period=hour',
    );
  });
});
