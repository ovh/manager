import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { forkBackup, getBackup, getBackups } from './backups.api';

describe('backup functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getBackups', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getBackups({
      projectId: 'projectId',
      notebookId: 'notebookId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook/notebookId/backup',
    );
  });

  it('should call getBackup', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getBackup({
      projectId: 'projectId',
      notebookId: 'notebookId',
      backupId: 'backupId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook/notebookId/backup/backupId',
    );
  });

  it('should call addNotebook', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await forkBackup({
      projectId: 'projectId',
      notebookId: 'notebookId',
      backupId: 'backupId',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook/notebookId/backup/backupId/fork',
    );
  });
});
