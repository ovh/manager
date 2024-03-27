import { apiClient } from '@ovh-ux/manager-core-api';
import { Vrack } from '@/models/network';

export const getVrack = async (projectId: string) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/vrack`)
    .then((res) => res.data as Vrack);
