import { PCIData } from '..';
import { apiClient } from '../api.client';
import storages, { Storages } from '@/types/Storages';

export interface StoragesParams extends PCIData {
  archive: boolean;
  withObjects: boolean;
}

export const getStorages = async ({
  projectId,
  archive = false,
  withObjects = false,
}: StoragesParams) =>
  apiClient.aapi.get<Storages>(`/cloud/project/${projectId}/storages`, {
    params: {
      archive,
      withObjects,
    },
  });

export const getStorageAccess = async ({ projectId }: PCIData) =>
  apiClient.v6.post<storages.ContainerAccess>(
    `/cloud/project/${projectId}/storage/access`,
  );
