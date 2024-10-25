import { apiClient } from '@ovh-ux/manager-core-api';
import * as ai from '@/types/cloud/project/ai';

import { NotebookData, PCIAi } from '../..';

export const getNotebooks = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/notebook`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as ai.notebook.Notebook[]);

export const getNotebook = async ({ projectId, notebookId }: NotebookData) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/notebook/${notebookId}`)
    .then((res) => res.data as ai.notebook.Notebook);

export interface AddNotebook extends PCIAi {
  notebookInfo: ai.notebook.NotebookSpec;
}
export const addNotebook = async ({ projectId, notebookInfo }: AddNotebook) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/notebook`, notebookInfo)
    .then((res) => res.data as ai.notebook.Notebook);
