import cloud from '@/types/Cloud';
import storages from '@/types/Storages';
import { PCIData } from '..';
import { apiClient } from '../api.client';

export interface SwiftData extends PCIData {
  containerId: string;
}

export interface SwiftDataParams extends SwiftData {
  noObjects: boolean;
  prefix?: string;
}

export const getSwiftStorage = async ({
  projectId,
  containerId,
  noObjects = false,
  prefix,
}: SwiftDataParams) =>
  apiClient.v6.get<storages.ContainerDetail>(
    `/cloud/project/${projectId}/storage/${containerId}`,
    {
      params: {
        noObjects,
        prefix,
      },
    },
  );

export interface EditSwiftData extends PCIData {
  containerId: string;
  data: {
    containerType: storages.TypeEnum;
  };
}

export const editSwiftStorage = async ({
  projectId,
  containerId,
  data,
}: EditSwiftData) =>
  apiClient.v6.put(`/cloud/project/${projectId}/storage/${containerId}`, data);

export const deleteSwiftStorage = async ({
  projectId,
  containerId,
}: SwiftData) =>
  apiClient.v6.delete(`/cloud/project/${projectId}/storage/${containerId}`);

export interface CreateSwiftData extends PCIData {
  container: cloud.ProjectStorageCreation;
  containerType: storages.TypeEnum;
}
export const createSwiftStorage = async ({
  projectId,
  container,
  containerType,
}: CreateSwiftData) => {
  const storageData = await apiClient.v6.post<storages.Container>(
    `/cloud/project/${projectId}/storage/`,
    container,
  );
  await editSwiftStorage({
    projectId,
    containerId: storageData.id,
    data: {
      containerType,
    },
  });
  return storageData;
};
