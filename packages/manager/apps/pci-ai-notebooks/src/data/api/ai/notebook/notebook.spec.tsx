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
} from '@/data/api/ai/notebook/notebook.api';
import { mockedNotebookSpec } from '@/__tests__/helpers/mocks/notebook';

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
        env: {
          editorId: 'editor',
          frameworkId: 'frameworkId',
          frameworkVersion: 'frameworkVersion',
        },
        envVars: [
          {
            name: 'envVarsName',
            value: 'envVarsValue',
          },
        ],
        name: 'name',
        region: 'region',
        resources: {
          cpu: 1,
          ephemeralStorage: 1,
          flavor: 'flavor',
          gpu: 1,
          memory: 1,
          privateNetwork: 1,
          publicNetwork: 1,
        },
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
        env: {
          editorId: 'editor',
          frameworkId: 'frameworkId',
          frameworkVersion: 'frameworkVersion',
        },
        envVars: [
          {
            name: 'envVarsName',
            value: 'envVarsValue',
          },
        ],
        name: 'name',
        region: 'region',
        resources: {
          cpu: 1,
          ephemeralStorage: 1,
          flavor: 'flavor',
          gpu: 1,
          memory: 1,
          privateNetwork: 1,
          publicNetwork: 1,
        },
      },
    );
  });
});
