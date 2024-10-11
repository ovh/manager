import { apiClient } from '@ovh-ux/manager-core-api';
import * as ai from '@/types/cloud/project/ai';
import { PCIAi } from '..';

export const getAuthorization = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/authorization`)
    .then((res) => res.data as ai.AuthorizationStatus);

export const postAuthorization = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/authorization`)
    .then((res) => res.data as ai.AuthorizationStatus);
