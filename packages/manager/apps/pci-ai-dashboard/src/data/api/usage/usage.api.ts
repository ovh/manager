import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '..';

export const getCurrentUsage = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/usage/current`)
    .then((res) => res.data);
