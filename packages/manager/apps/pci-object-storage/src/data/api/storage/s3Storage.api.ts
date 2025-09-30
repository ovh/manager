import { StorageContainer } from '@datatr-ux/ovhcloud-types/cloud/index';
import { PCIData } from '..';
import { apiClient } from '../api.client';
import storages from '@/types/Storages';

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
  apiClient.v6.get<StorageContainer>(
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
