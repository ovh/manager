/*
import { describe, expect, vi } from 'vitest';
import { apiClient } from '@ovh-ux/manager-core-api';
import {
  getAdvancedConfiguration,
  getAdvancedConfigurationCapabilities,
  updateAdvancedConfiguration,
} from '@/data/api/advancedConfiguration';
import { database } from '@/models/database';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const put = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
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
    getAdvancedConfiguration(data);
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
    updateAdvancedConfiguration({
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
*/
