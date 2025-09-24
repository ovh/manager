import { v6 } from '@ovh-ux/manager-core-api';
import { OBJECT_STORAGE_USER_ROLE } from '@/constants';

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

export const deleteUser = async (
  projectId: string,
  userId: string,
  accessKey: string,
) => {
  await v6.delete(
    `/cloud/project/${projectId}/user/${userId}/s3Credentials/${accessKey}`,
  );
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

export const postS3Secret = async (
  projectId: string,
  userId: number,
  userAccess: string,
): Promise<{ secret: string }> => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/user/${userId}/s3Credentials/${userAccess}/secret`,
  );

  return data;
};

export const importUserPolicy = async (
  projectId: string,
  userId: string,
  policy: string,
) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/user/${userId}/policy`,
    {
      policy,
    },
  );
  return data;
};

export const generateS3Credentials = async (
  projectId: string,
  userId: number,
): Promise<TS3Credentials> => {
  const { data } = await v6.post<TS3Credentials>(
    `/cloud/project/${projectId}/user/${userId}/s3Credentials`,
  );
  return data;
};

export const createUser = async (
  projectId: string,
  description: string,
  role: string = OBJECT_STORAGE_USER_ROLE,
): Promise<TUser> => {
  const { data } = await v6.post<TUser>(`/cloud/project/${projectId}/user`, {
    description,
    role,
  });

  return data;
};
