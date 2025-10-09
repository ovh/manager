import {
  StorageContainer,
  StorageObject,
  StorageContainerUpdate,
} from '@datatr-ux/ovhcloud-types/cloud/index';
import { PCIData } from '..';
import { apiClient } from '../api.client';
import storages from '@/types/Storages';
import cloud from '@/types/Cloud';

export interface S3Data extends PCIData {
  name: string;
  region: string;
}

export interface S3DataParams extends S3Data {
  limit?: number;
  marker?: string;
  prefix?: string;
}

export const getS3Storage = async ({
  projectId,
  region,
  name,
  limit,
  marker,
  prefix,
}: S3DataParams) =>
  apiClient.v6.get<cloud.StorageContainer>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}`,
    {
      params: {
        limit,
        marker,
        prefix,
      },
    },
  );

export const deleteS3Storage = async ({ projectId, region, name }: S3Data) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/region/${region}/storage/${name}`,
  );

export interface UpdateS3Data extends S3Data {
  data: StorageContainerUpdate;
}

export const udpateS3Storage = async ({
  projectId,
  region,
  name,
  data,
}: UpdateS3Data) =>
  apiClient.v6.put<StorageContainer>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}`,
    data,
  );

export interface AddS3Policy extends S3Data {
  userId: number;
  data: {
    roleName: storages.PolicyRoleEnum;
  };
}

export const addS3UserPolicy = async ({
  projectId,
  region,
  name,
  userId,
  data,
}: AddS3Policy) =>
  apiClient.v6.post(
    `/cloud/project/${projectId}/region/${region}/storage/${name}/policy/${userId}`,
    data,
  );

export interface CreateS3Storage extends PCIData {
  region: string;
  data: cloud.StorageContainerCreation;
}
export const createS3Storage = async ({
  projectId,
  region,
  data,
}: CreateS3Storage) =>
  apiClient.v6.post<cloud.StorageContainer>(
    `/cloud/project/${projectId}/region/${region}/storage`,
    data,
  )

export interface S3ObjectsParams extends S3Data {
  limit?: number;
  keyMarker?: string;
  prefix?: string;
  versionIdMarker?: string;
  withVersions?: boolean;
}

export const getS3Objects = async ({
  projectId,
  region,
  name,
  limit,
  keyMarker,
  prefix,
  versionIdMarker,
  withVersions,
}: S3ObjectsParams) =>
  apiClient.v6.get<StorageObject[]>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}/object`,
    {
      params: {
        limit,
        keyMarker,
        prefix,
        versionIdMarker,
        withVersions,
      },
    },
  );

export interface S3ObjectParams extends S3Data {
  key: string;
}

export const getS3Object = async ({
  projectId,
  region,
  name,
  key,
}: S3ObjectParams) =>
  apiClient.v6.get<StorageObject>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}/object/${key}`,
  );
