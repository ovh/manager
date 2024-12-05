import { apiClient } from '@ovh-ux/manager-core-api';
import * as ai from '@/types/cloud/project/ai';
import { NotebookData } from '@/data/api';

export const getBackups = async ({ projectId, notebookId }: NotebookData) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/notebook/${notebookId}/backup`)
    .then((res) => res.data as ai.notebook.Backup[]);

export interface BackupData extends NotebookData {
  backupId: string;
}

export const getBackup = async ({
  projectId,
  notebookId,
  backupId,
}: BackupData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/ai/notebook/${notebookId}/backup/${backupId}`,
    )
    .then((res) => res.data as ai.notebook.Backup);

export const forkBackup = async ({
  projectId,
  notebookId,
  backupId,
}: BackupData) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/ai/notebook/${notebookId}/backup/${backupId}/fork`,
    )
    .then((res) => res.data as ai.notebook.Notebook);
