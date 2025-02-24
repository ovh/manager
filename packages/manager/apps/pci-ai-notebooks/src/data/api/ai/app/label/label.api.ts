import { apiClient } from '@ovh-ux/manager-core-api';
import { AppData } from '@/data/api';
import * as ai from '@/types/cloud/project/ai';

export interface EditLabelProps extends AppData {
  label: ai.Label;
}

export const editLabel = async ({ projectId, appId, label }: EditLabelProps) =>
  apiClient.v6
    .put(`/cloud/project/${projectId}/ai/app/${appId}/label`, label)
    .then((res) => res.data);
