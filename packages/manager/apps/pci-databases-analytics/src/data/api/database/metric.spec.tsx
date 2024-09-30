import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getMetrics, getMetric } from '@/data/api/database/metric.api';
import * as database from '@/types/cloud/project/database';

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
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/metric?extended=false',
    );
  });

  it('should call getMetric', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getMetric({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      metric: 'metricName',
      period: database.service.MetricPeriodEnum.lastHour,
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/metric/metricName?period=lastHour',
    );
  });
});
