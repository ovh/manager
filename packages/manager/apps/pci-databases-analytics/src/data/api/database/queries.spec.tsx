import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  getCurrentQueries,
  cancelCurrentQuery,
  getQueryStatistics,
  resetQueryStatistics,
} from '@/data/api/database/queries.api';
import * as database from '@/types/cloud/project/database';

vi.mock('@ovh-ux/manager-core-api', () => {
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

describe('query service functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getCurrentQueries', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getCurrentQueries({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/currentQueries',
    );
  });

  it('should call cancelCurrentQuery', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await cancelCurrentQuery({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      pid: 123,
      terminate: true,
    });
    expect(
      apiClient.v6.post,
    ).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/currentQueries/cancel',
      { pid: 123, terminate: true },
    );
  });

  it('should call getQueryStatistics', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getQueryStatistics({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/queryStatistics',
    );
  });

  it('should call resetQueryStatistics', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await resetQueryStatistics({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/queryStatistics/reset',
    );
  });
});
