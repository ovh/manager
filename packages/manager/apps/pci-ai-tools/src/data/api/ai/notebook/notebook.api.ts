import { apiClient } from '@ovh-ux/manager-core-api';
import { AxiosResponse } from 'axios';
import ai from '@/types/AI';
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
  notebookInfo: ai.notebook.NotebookSpecInput;
}
export const addNotebook = async ({ projectId, notebookInfo }: AddNotebook) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/notebook`, notebookInfo)
    .then((res) => res.data as ai.notebook.Notebook);

export const startNotebook = async ({
  projectId,
  notebookId,
}: NotebookData) => {
  return apiClient.v6
    .put(`/cloud/project/${projectId}/ai/notebook/${notebookId}/start`)
    .then((res) => res.data as ai.notebook.Notebook);
};

export const stopNotebook = async ({ projectId, notebookId }: NotebookData) => {
  return apiClient.v6
    .put(`/cloud/project/${projectId}/ai/notebook/${notebookId}/stop`)
    .then((res) => res.data as ai.notebook.Notebook);
};

export const deleteNotebook = async ({
  projectId,
  notebookId,
}: NotebookData): Promise<AxiosResponse<void>> =>
  apiClient.v6.delete(`/cloud/project/${projectId}/ai/notebook/${notebookId}`);

export const getCommand = async ({ projectId, notebookInfo }: AddNotebook) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/notebook/command`, notebookInfo)
    .then((res) => res.data as ai.Command);

export interface UpdateNotebook extends NotebookData {
  notebookInfo: ai.notebook.NotebookUpdate;
}
export const updateNotebook = async ({
  projectId,
  notebookId,
  notebookInfo,
}: UpdateNotebook) =>
  apiClient.v6
    .put(`/cloud/project/${projectId}/ai/notebook/${notebookId}`, notebookInfo)
    .then((res) => res.data as ai.notebook.Notebook);
