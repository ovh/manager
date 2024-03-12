import { apiClient } from '@ovh-ux/manager-core-api';
import { Network, Subnet } from '@/models/network';

export const networkApi = {
  getPrivateNetworks: async (projectId: string) =>
    apiClient.v6
      .get(`/cloud/project/${projectId}/network/private`)
      .then((res) => res.data as Network[]),
  getSubnets: async (projectId: string, networkId: string) =>
    apiClient.v6
      .get(`/cloud/project/${projectId}/network/private/${networkId}/subnet`)
      .then((res) => res.data as Subnet[]),
};
