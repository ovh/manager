import { apiClient } from '@ovh-ux/manager-core-api';
import ai from '@/types/AI';
import { PCIAi } from '..';

export const getAuthorization = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/authorization`)
    .then((res) => res.data as ai.AuthorizationStatus);

export const postAuthorization = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/authorization`)
    .then((res) => res.data as ai.AuthorizationStatus);
