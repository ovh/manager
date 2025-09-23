import { describe, expect, vi } from 'vitest';
import { apiClient } from '@/data/api/api.client';
import {
  getPrometheus,
  resetPrometheusUserPassword,
} from '@/data/api/database/prometheus.api';
import * as database from '@/types/cloud/project/database';

vi.mock('@/data/api/api.client', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: { queries: [] } });
  });
  const post = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        get,
        post,
      },
    },
  };
});

describe('prometheus api functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getPrometheus', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getPrometheus({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/prometheus',
    );
  });

  it('should call resetPrometheusUserPassword', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await resetPrometheusUserPassword({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/prometheus/credentials/reset',
    );
  });
});
