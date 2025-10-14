import { describe, expect, vi } from 'vitest';
import { apiClient } from '@/data/api/api.client';
import {
  getAdvancedConfiguration,
  getAdvancedConfigurationCapabilities,
  editAdvancedConfiguration,
} from '@/data/api/database/advancedConfiguration.api';
import * as database from '@/types/cloud/project/database';

vi.mock('@/data/api/api.client', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/data/api/api.client')>();
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const put = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    ...mod,
    apiClient: {
      v6: {
        get,
        put,
      },
    },
  };
});

const data = {
  projectId: 'projectId',
  engine: database.EngineEnum.mongodb,
  serviceId: 'serviceId',
};

describe('database api advanced configuration', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should call get advancedConfiguration', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getAdvancedConfiguration(data);
    const { projectId, engine, serviceId } = data;
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/advancedConfiguration`,
      {
        headers: {
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call get advancedConfigurationCapabilities', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    getAdvancedConfigurationCapabilities(data);
    const { projectId, engine, serviceId } = data;
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/capabilities/advancedConfiguration`,
    );
  });

  it('should call put advancedConfiguration', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    editAdvancedConfiguration({
      ...data,
      advancedConfiguration: {
        foo: 'bar',
      },
    });
    const { projectId, engine, serviceId } = data;
    expect(
      apiClient.v6.put,
    ).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/advancedConfiguration`,
      { foo: 'bar' },
    );
  });
});
