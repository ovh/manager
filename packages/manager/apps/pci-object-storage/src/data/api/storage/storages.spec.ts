import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getStorageAccess, getStorages } from './storages.api';

describe('Storages API functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getStorages', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getStorages({
      projectId: 'projectId',
      archive: false,
      withObjects: false,
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/storages',
      {
        params: {
          archive: false,
          withObjects: false,
        },
      },
    );
  });

  it('should call getStorages', async () => {
    expect(apiClient.aapi.get).not.toHaveBeenCalled();
    await getStorages({
      projectId: 'projectId',
      archive: false,
      withObjects: false,
    });
    expect(apiClient.aapi.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/storages',
      {
        params: {
          archive: false,
          withObjects: false,
        },
      },
    );
  });

  it('should call getStorageAccess', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await getStorageAccess({
      projectId: 'projectId',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/storage/access',
      undefined,
      undefined,
    );
  });
});
