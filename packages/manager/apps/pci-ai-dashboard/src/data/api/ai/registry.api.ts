import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '..';
import * as ai from '@/types/cloud/project/ai';

export const getRegistries = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/registry`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as ai.registry.Registry[]);

export interface AddRegistryProps extends PCIAi {
  registry: {
    password: string;
    region: string;
    url: string;
    username: string;
  };
}
export const addRegistry = async ({ projectId, registry }: AddRegistryProps) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/registry`, registry)
    .then((res) => res.data as ai.registry.Registry);

export interface EditRegistryProps extends PCIAi {
  registryId: string;
  registry: ai.registry.RegistryUpdateInput;
}
export const editRegistry = async ({
  projectId,
  registryId,
  registry,
}: EditRegistryProps) =>
  apiClient.v6
    .put(`/cloud/project/${projectId}/ai/registry/${registryId}`, registry)
    .then((res) => res.data as ai.registry.Registry);

export interface DeleteRegistryProps extends PCIAi {
  registryId: string;
}
export const deleteRegistry = async ({
  projectId,
  registryId,
}: DeleteRegistryProps) =>
  apiClient.v6.delete(`/cloud/project/${projectId}/ai/registry/${registryId}`);
