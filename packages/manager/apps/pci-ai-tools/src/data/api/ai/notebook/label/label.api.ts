import { apiClient } from '@ovh-ux/manager-core-api';
import { NotebookData } from '@/data/api';
import ai from '@/types/AI';

export interface EditLabelProps extends NotebookData {
  label: ai.Label;
}

export const editLabel = async ({
  projectId,
  notebookId,
  label,
}: EditLabelProps) =>
  apiClient.v6
    .put(`/cloud/project/${projectId}/ai/notebook/${notebookId}/label`, label)
    .then((res) => res.data);
