import { v6 } from '@ovh-ux/manager-core-api';

export type TS3Credentials = {
  userId: string;
  tenantId: string;
  access: string;
};

export type TUser = {
  id: number;
  username: string;
  creationDate: string;
  description: string;
  openstackId: string;
  status: string;
  access?: string;
  search?: string;
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

export const getUser = async (
  projectId: string,
  userId: string,
): Promise<TUser> => {
  const { data } = await v6.get<TUser>(
    `/cloud/project/${projectId}/user/${userId}`,
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
