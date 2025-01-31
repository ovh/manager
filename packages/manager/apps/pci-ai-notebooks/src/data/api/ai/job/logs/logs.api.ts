import { apiClient } from '@ovh-ux/manager-core-api';
import * as ai from '@/types/cloud/project/ai';
import { JobData } from '@/data/api';

export const getLogs = async ({ projectId, jobId }: JobData) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/job/${jobId}/log`)
    .then((res) => res.data as ai.Logs);
