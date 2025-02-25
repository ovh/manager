import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  addApp,
  deleteApp,
  getApp,
  getApps,
  getCommand,
  startApp,
  stopApp,
  updateApp,
} from './app.api';
import { mockedAppSpec, mockedAppUpdate } from '@/__tests__/helpers/mocks/app';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const post = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const put = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const del = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        get,
        post,
        put,
        delete: del,
      },
    },
  };
});

describe('app functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getApps', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getApps({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/app',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call getApp', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getApp({
      projectId: 'projectId',
      appId: 'appId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/app/appId',
    );
  });

  it('should call addApp', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addApp({
      projectId: 'projectId',
      appInfo: mockedAppSpec,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/app',
      {
        image: 'image',
        name: 'name',
        grpcPort: 8080,
        command: ['command'],
        defaultHttpPort: 8080,
        deploymentStrategy: {
          maxSurge: 'maxSurge',
          maxUnavailable: 'maxUnavailable',
          progressDeadlineSeconds: 120,
        },
        region: 'region',
        resources: {
          cpu: 20,
          ephemeralStorage: 20,
          flavor: 'flavor',
          gpu: 2,
          memory: 180,
          privateNetwork: 80,
          publicNetwork: 60,
        },
        scalingStrategy: {
          fixed: {
            replicas: 1,
          },
        },
        unsecureHttp: false,
      },
    );
  });

  it('should call stopApp', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await stopApp({
      projectId: 'projectId',
      appId: 'appId',
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/app/appId/stop',
    );
  });

  it('should call startApp', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await startApp({
      projectId: 'projectId',
      appId: 'appId',
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/app/appId/start',
    );
  });

  it('should call deleteApp', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await deleteApp({
      projectId: 'projectId',
      appId: 'appId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/app/appId',
    );
  });

  it('should call updateApp', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await updateApp({
      projectId: 'projectId',
      appId: 'appId',
      appInfo: mockedAppUpdate,
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/app/appId',
      {
        command: ['command'],
        cpu: 1,
        defaultHttpPort: 8080,
        flavor: 'flavor',
        gpu: 1,
        grpcPort: 8080,
        url: 'test',
      },
    );
  });

  it('should call getCommand', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await getCommand({
      projectId: 'projectId',
      appInfo: mockedAppSpec,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/app/command',
      {
        image: 'image',
        name: 'name',
        grpcPort: 8080,
        command: ['command'],
        defaultHttpPort: 8080,
        deploymentStrategy: {
          maxSurge: 'maxSurge',
          maxUnavailable: 'maxUnavailable',
          progressDeadlineSeconds: 120,
        },
        region: 'region',
        resources: {
          cpu: 20,
          ephemeralStorage: 20,
          flavor: 'flavor',
          gpu: 2,
          memory: 180,
          privateNetwork: 80,
          publicNetwork: 60,
        },
        scalingStrategy: {
          fixed: {
            replicas: 1,
          },
        },
        unsecureHttp: false,
      },
    );
  });
});
