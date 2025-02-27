import { apiClient } from '@ovh-ux/manager-core-api';
import * as ai from '@/types/cloud/project/ai';
import { NotebookData } from '@/data/api';
import { mockedLogs } from '@/__tests__/helpers/mocks/shared/logs';

export const getLogs = async ({ projectId, notebookId }: NotebookData) => {
  // apiClient.v6
  //   .get(`/cloud/project/${projectId}/ai/notebook/${notebookId}/log`)
  //   .then((res) => res.data as ai.Logs);
  return mockedLogs;
};
