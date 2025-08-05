import { apiClient } from '@ovh-ux/manager-core-api';
import ai from '@/types/AI';
import { AppData } from '@/data/api';

export const getLogs = async ({ projectId, appId }: AppData) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/app/${appId}/log`)
    .then((res) => res.data as ai.Logs);
