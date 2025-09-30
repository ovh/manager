import { PCIData } from '..';
import { apiClient } from '../api.client';
import storages from '@/types/Storages';

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
