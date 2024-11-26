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
  userId: number,
): Promise<TS3Credentials> => {
  const { data } = await v6.get<TS3Credentials>(
    `/cloud/project/${projectId}/user/${userId}/s3Credentials`,
  );
  return data;
};
