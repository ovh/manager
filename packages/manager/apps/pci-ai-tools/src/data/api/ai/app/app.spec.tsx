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
import {
  mockedAppSpec,
  mockedAppUpdate,
} from '@/__tests__/helpers/mocks/app/app';

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
        image: mockedAppSpec.image,
        name: mockedAppSpec.name,
        grpcPort: mockedAppSpec.grpcPort,
        command: mockedAppSpec.command,
        defaultHttpPort: mockedAppSpec.defaultHttpPort,
        deploymentStrategy: mockedAppSpec.deploymentStrategy,
        region: mockedAppSpec.region,
        resources: mockedAppSpec.resources,
        scalingStrategy: mockedAppSpec.scalingStrategy,
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
        image: mockedAppSpec.image,
        name: mockedAppSpec.name,
        grpcPort: mockedAppSpec.grpcPort,
        command: mockedAppSpec.command,
        defaultHttpPort: mockedAppSpec.defaultHttpPort,
        deploymentStrategy: mockedAppSpec.deploymentStrategy,
        region: mockedAppSpec.region,
        resources: mockedAppSpec.resources,
        scalingStrategy: mockedAppSpec.scalingStrategy,
        unsecureHttp: false,
      },
    );
  });
});
