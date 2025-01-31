import { v6 } from '@ovh-ux/manager-core-api';

export type TS3Credentials = {
  userId: string;
  tenantId: string;
  access: string;
  secret: string;
};

export type TUser = {
  id: number;
  username: string;
  creationDate: string;
  description: string;
  openstackId: string;
  status: 'creating' | 'ok' | 'deleting' | 'deleted';
  access?: string;
  search?: string;
  password: string;
  s3Credentials?: TS3Credentials;
  roles: {
    id: string;
    name: string;
    description: string;
    permissions: string[];
  }[];
};

export const getUser = async (
  projectId: string,
  userId: number,
): Promise<TUser> => {
  const { data } = await v6.get<TUser>(
    `/cloud/project/${projectId}/user/${userId}`,
  );
  return data;
};

export const getAllUsers = async (projectId: string): Promise<TUser[]> => {
  const { data } = await v6.get<TUser[]>(`/cloud/project/${projectId}/user`);
  return data;
};

export const getS3Credentials = async (
  projectId: string,
  userId: string,
): Promise<TS3Credentials[]> => {
  const { data } = await v6.get<TS3Credentials[]>(
    `/cloud/project/${projectId}/user/${userId}/s3Credentials`,
  );
  return data;
};

export const getUserStoragePolicy = async (
  projectId: string,
  userId: number,
): Promise<{ policy: string }> => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/user/${userId}/policy`,
  );
  return data;
};
