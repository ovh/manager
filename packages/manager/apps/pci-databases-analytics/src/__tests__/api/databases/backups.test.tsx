import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  getServiceBackups,
  restoreBackup,
} from '../../../api/databases/backups';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
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

describe('backup service functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getServiceBackups', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getServiceBackups({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/backup',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call restoreBackup with backupId', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await restoreBackup({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
      backupId: 'backupId',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/backup/backupId/restore',
    );
  });

  it('should call restoreBackup with restore data', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await restoreBackup({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
      restore: { someData: 'someValue' },
    });
    expect(
      apiClient.v6.post,
    ).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/restore',
      { someData: 'someValue' },
    );
  });
});
