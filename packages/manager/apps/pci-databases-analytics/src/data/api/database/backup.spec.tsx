import { describe, expect, vi } from 'vitest';
import { apiClient } from '@/data/api/api.client';
import {
  getServiceBackups,
  restoreBackup,
} from '@/data/api/database/backup.api';
import * as database from '@/types/cloud/project/database';

vi.mock('@/data/api/api.client', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/data/api/api.client')>();
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const post = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    ...mod,
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
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/backup',
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
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      backupId: 'backupId',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/backup/backupId/restore',
    );
  });

  it('should call restoreBackup with restore data', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await restoreBackup({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      restore: { pointInTime: '123' },
    });
    expect(
      apiClient.v6.post,
    ).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/restore',
      { pointInTime: '123' },
    );
  });
});
