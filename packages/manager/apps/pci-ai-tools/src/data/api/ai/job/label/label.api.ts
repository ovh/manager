import { apiClient } from '@ovh-ux/manager-core-api';
import { JobData } from '@/data/api';
import ai from '@/types/AI';

export interface EditLabelProps extends JobData {
  label: ai.Label;
}

export const editLabel = async ({ projectId, jobId, label }: EditLabelProps) =>
  apiClient.v6
    .put(`/cloud/project/${projectId}/ai/job/${jobId}/label`, label)
    .then((res) => res.data);
