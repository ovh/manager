import user from '@/types/User';
import { PCIData } from '..';
import { apiClient } from '../api.client';
import storages from '@/types/Storages';

export const getUsers = async ({ projectId }: PCIData) =>
  apiClient.v6.get<user.User[]>(`/cloud/project/${projectId}/user`);

export interface AddUserProps extends PCIData {
  newUser: {
    description: string;
    role: user.RoleEnum;
  };
}
export const addUser = async ({ projectId, newUser }: AddUserProps) =>
  apiClient.v6.post<user.UserDetail>(
    `/cloud/project/${projectId}/user`,
    newUser,
  );

export interface UserProps extends PCIData {
  userId: number;
}

export const getUser = async ({ projectId, userId }: UserProps) =>
  apiClient.v6.get<user.User>(`/cloud/project/${projectId}/user/${userId}`);

export const getUserS3Credentials = async ({ projectId, userId }: UserProps) =>
  apiClient.v6.get<user.S3Credentials[]>(
    `/cloud/project/${projectId}/user/${userId}/s3Credentials`,
  );

export const getUserPolicy = async ({ projectId, userId }: UserProps) =>
  apiClient.v6.get<storages.PolicyRaw>(
    `/cloud/project/${projectId}/user/${userId}/policy`,
  );

export interface UserPropsWithRegion extends UserProps {
  region: string;
}

export const getUserRclone = async ({
  projectId,
  userId,
  region,
}: UserPropsWithRegion) =>
  apiClient.v6.get<user.Rclone>(
    `/cloud/project/${projectId}/user/${userId}/rclone?region=${encodeURIComponent(
      region,
    )}`,
  );

export interface S3CredsProps extends UserProps {
  accessKey: string;
}

export const getUserSecretKey = async ({
  projectId,
  userId,
  accessKey,
}: S3CredsProps) =>
  apiClient.v6.post<user.S3CredentialsSecretOnly>(
    `/cloud/project/${projectId}/user/${userId}/s3Credentials/${accessKey}/secret`,
  );

export const addS3Credentials = async ({ projectId, userId }: UserProps) =>
  apiClient.v6.post<user.S3CredentialsWithSecret>(
    `/cloud/project/${projectId}/user/${userId}/s3Credentials`,
  );

export const deleteS3Credentials = async ({
  projectId,
  userId,
  accessKey,
}: S3CredsProps) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/user/${userId}/s3Credentials/${accessKey}`,
  );

export interface PolicyProps extends UserProps {
  policyData: storages.PolicyRaw;
}

export const addUserPolicy = async ({
  projectId,
  userId,
  policyData,
}: PolicyProps) =>
  apiClient.v6.post(
    `/cloud/project/${projectId}/user/${userId}/policy`,
    policyData,
  );
