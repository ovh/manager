import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  addNotebook,
  deleteNotebook,
  getCommand,
  getNotebook,
  getNotebooks,
  startNotebook,
  stopNotebook,
  updateNotebook,
} from '@/data/api/ai/notebook/notebook.api';
import {
  mockedNotebookSpec,
  mockedNotebookUpdateInput,
} from '@/__tests__/helpers/mocks/notebook/notebook';
import { mockedCPUResources } from '@/__tests__/helpers/mocks/shared/resource';
import { mockedSshKey } from '@/__tests__/helpers/mocks/sshkey';
import { mockedVolume } from '@/__tests__/helpers/mocks/volume/volume';

describe('notebook functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getNotebooks', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getNotebooks({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call getNotebook', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getNotebook({
      projectId: 'projectId',
      notebookId: 'notebookId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook/notebookId',
    );
  });

  it('should call addNotebook', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addNotebook({
      projectId: 'projectId',
      notebookInfo: mockedNotebookSpec,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook',
      {
        env: mockedNotebookSpec.env,
        envVars: mockedNotebookSpec.envVars,
        name: mockedNotebookSpec.name,
        region: mockedNotebookSpec.region,
        resources: mockedNotebookSpec.resources,
        volumes: mockedNotebookSpec.volumes,
      },
    );
  });

  it('should call startNotebook', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await startNotebook({
      projectId: 'projectId',
      notebookId: 'notebookId',
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook/notebookId/start',
    );
  });

  it('should call stopNotebook', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await stopNotebook({
      projectId: 'projectId',
      notebookId: 'notebookId',
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook/notebookId/stop',
    );
  });

  it('should call deleteNotebook', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await deleteNotebook({
      projectId: 'projectId',
      notebookId: 'notebookId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook/notebookId',
    );
  });

  it('should call getCommand', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await getCommand({
      projectId: 'projectId',
      notebookInfo: mockedNotebookSpec,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook/command',
      {
        env: mockedNotebookSpec.env,
        envVars: mockedNotebookSpec.envVars,
        name: mockedNotebookSpec.name,
        region: mockedNotebookSpec.region,
        resources: mockedNotebookSpec.resources,
        volumes: mockedNotebookSpec.volumes,
      },
    );
  });

  it('should call updateNotebook', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await updateNotebook({
      projectId: 'projectId',
      notebookId: 'notebookId',
      notebookInfo: mockedNotebookUpdateInput,
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook/notebookId',
      {
        labels: { key: 'label' },
        resources: mockedCPUResources,
        sshPublicKeys: [mockedSshKey.publicKey],
        unsecureHttp: false,
        volumes: [mockedVolume],
      },
    );
  });
});
