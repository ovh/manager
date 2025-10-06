import { ProjectStoragePublicUrlCreation } from '@datatr-ux/ovhcloud-types/cloud/index';
import { HeaderXAuthToken, HeadersNoCache, PCIData } from '..';
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
      headers: HeadersNoCache,
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

export interface DownloadSwiftData extends SwiftData {
  data: ProjectStoragePublicUrlCreation;
}

export const downloadObject = async ({
  projectId,
  containerId,
  data,
}: DownloadSwiftData) =>
  apiClient.v6.post<storages.ContainerObjectTempURL>(
    `/cloud/project/${projectId}/storage/${containerId}/publicUrl`,
    data,
  );

export interface SwiftObjectData {
  token: string;
  url: string;
}

export interface DeleteSwiftObjectData extends SwiftObjectData {
  storageName: string;
  objectName: string;
}

export const deleteSwiftObject = async ({
  storageName,
  objectName,
  token,
  url,
}: DeleteSwiftObjectData): Promise<Response> => {
  return apiClient.ws.delete(
    `${url}/${storageName}/${encodeURIComponent(objectName)}`,
    {
      method: 'DELETE',
      headers: {
        [HeaderXAuthToken]: token,
      },
    },
  );
};

export interface AddSwiftObjectData extends SwiftObjectData {
  file: File;
}

export const addSwiftObject = async ({
  file,
  token,
  url,
}: AddSwiftObjectData): Promise<Response> => {
  return apiClient.ws.put(url, file, {
    headers: {
      'Content-Type': file.type,
      [HeaderXAuthToken]: token,
    },
  });
};
