import {
  StorageContainer,
  StorageObject,
  StorageContainerUpdate,
} from '@datatr-ux/ovhcloud-types/cloud';
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

export const updateS3Storage = async ({
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
  );

export interface PresignS3Params extends S3Data {
  data: storages.PresignedURLInput;
}

export const getPresignUrlS3 = async ({
  projectId,
  region,
  name,
  data,
}: PresignS3Params) =>
  apiClient.v6.post<storages.PresignedURL>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}/presign`,
    data,
  );

export interface AddS3ObjectParams extends storages.PresignedURL {
  file: File;
}

export const addS3Object = async ({
  signedHeaders,
  url,
  file,
}: AddS3ObjectParams): Promise<Response> => {
  return apiClient.ws.put(url, file, {
    headers: {
      'Content-Type': file.type,
      ...signedHeaders,
    },
  });
};

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
    `/cloud/project/${projectId}/region/${region}/storage/${name}/object/${encodeURIComponent(
      key,
    )}`,
  );

export const deleteS3Object = async ({
  projectId,
  region,
  name,
  key,
}: S3ObjectParams) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/region/${region}/storage/${name}/object/${encodeURIComponent(
      key,
    )}`,
  );

export interface S3ObjectsVersionsParams extends S3ObjectParams {
  limit?: number;
  versionIdMarker?: string;
}

export const getS3ObjectVersions = async ({
  projectId,
  region,
  name,
  key,
  limit,
  versionIdMarker,
}: S3ObjectsVersionsParams) =>
  apiClient.v6.get<StorageObject[]>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}/object/${encodeURIComponent(
      key,
    )}/version`,
    {
      params: {
        limit,
        versionIdMarker,
      },
    },
  );

export interface S3ObjectsVersionParams extends S3ObjectParams {
  versionId: string;
}

export const getS3ObjectVersion = async ({
  projectId,
  region,
  name,
  key,
  versionId,
}: S3ObjectsVersionParams) =>
  apiClient.v6.get<StorageObject>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}/object/${encodeURIComponent(
      key,
    )}/version/${versionId}`,
  );

export const deleteS3ObjectVersion = async ({
  projectId,
  region,
  name,
  key,
  versionId,
}: S3ObjectsVersionParams) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/region/${region}/storage/${name}/object/${encodeURIComponent(
      key,
    )}/version/${versionId}`,
  );

export interface UpdateS3ObjectStorageClassParams extends S3ObjectParams {
  storageClass: storages.StorageClassEnum;
  versionId?: string;
}

export const updateS3ObjectStorageClass = async ({
  projectId,
  region,
  name,
  key,
  storageClass,
  versionId = '',
}: UpdateS3ObjectStorageClassParams) =>
  apiClient.v6.post<StorageObject>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}/object/${encodeURIComponent(
      key,
    )}/version/${versionId}/copy`,
    {
      storageClass,
      targetBucket: name,
      targetKey: key,
    },
  );

export interface RestoreS3ObjectParams extends S3ObjectParams {
  days: number;
}

export const restoreS3Object = async ({
  projectId,
  region,
  name,
  key,
  days,
}: RestoreS3ObjectParams) =>
  apiClient.v6.post(
    `/cloud/project/${projectId}/region/${region}/storage/${name}/object/${encodeURIComponent(
      key,
    )}/restore`,
    {
      days,
    },
  );

export interface BulkDeleteS3ObjectsParams extends S3Data {
  objects: Array<{ key: string; versionId?: string }>;
}

export const bulkDeleteS3Objects = async ({
  projectId,
  region,
  name,
  objects,
}: BulkDeleteS3ObjectsParams) =>
  apiClient.v6.post(
    `/cloud/project/${projectId}/region/${region}/storage/${name}/bulkDeleteObjects`,
    { objects },
  );
export interface CreateStorageJobParams {
  projectId: string;
  region: string;
  name: string;
}

export const createStorageJob = async ({
  projectId,
  region,
  name,
}: CreateStorageJobParams) => {
  return apiClient.v6.post(
    `/cloud/project/${projectId}/region/${region}/storage/${name}/job/replication`,
  );
};
