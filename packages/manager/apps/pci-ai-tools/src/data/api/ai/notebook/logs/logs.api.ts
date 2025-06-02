import { apiClient } from '@ovh-ux/manager-core-api';
import { NotebookData } from '@/data/api';
import ai from '@/types/AI';

export const getLogs = async ({ projectId, notebookId }: NotebookData) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/notebook/${notebookId}/log`)
    .then((res) => res.data as ai.Logs);
