import { apiClient } from '@/data/api/api.client';
import { Network, Subnet } from '@/types/cloud/network';
import { Vrack } from '@/types/cloud/Vrack';

export const networkApi = {
  getPrivateNetworks: async (projectId: string) =>
    apiClient.v6.get<Network[]>(`/cloud/project/${projectId}/network/private`),
  getSubnets: async (projectId: string, networkId: string) =>
    apiClient.v6.get<Subnet[]>(
      `/cloud/project/${projectId}/network/private/${networkId}/subnet`,
    ),
  getVrack: async (projectId: string) =>
    apiClient.v6.get<Vrack>(`/cloud/project/${projectId}/vrack`),
};
