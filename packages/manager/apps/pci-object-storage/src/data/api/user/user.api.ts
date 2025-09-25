import user from '@/types/User';
import { PCIData } from '..';
import { apiClient } from '../api.client';

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

export const getUserS3Credentials = async ({ projectId, userId }: UserProps) =>
  apiClient.v6.get<user.S3Credentials[]>(
    `/cloud/project/${projectId}/user/${userId}/s3Credentials`,
  );
