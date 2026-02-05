import { apiClient } from '@ovh-ux/manager-core-api';

export type IamUser = {
  login: string;
  description: string;
  email: string;
  group: string;
  groups: string[];
  lastUpdate: string;
  passwordLastUpdate: string;
  status: string;
  type: string;
  urn: string;
};

export type IamUserToken = {
  name: string;
  description: string;
  creation: string;
  expiresAt: string;
  lastUsed: string;
  token?: string;
};

export type IamUserTokenPayload = {
  name: string;
  description: string;
  expiresAt?: string;
  expiresIn?: number;
};

export const getIamUser = async (userId: string) => {
  const { data } = await apiClient.v6.get<IamUser>(
    `/me/identity/user/${userId}`,
  );
  return data;
};

export const getIamUserToken = async (userId: string, token: string) => {
  const { data } = await apiClient.v6.get<IamUserToken>(
    `/me/identity/user/${userId}/token/${token}`,
  );
  return data;
};

export const createIamUserToken = async (
  userId: string,
  payload: IamUserTokenPayload,
) => {
  const { data } = await apiClient.v6.post<IamUserToken>(
    `/me/identity/user/${userId}/token`,
    payload,
  );
  return data;
};

export const updateIamUserToken = async (
  userId: string,
  payload: IamUserTokenPayload,
) => {
  const updatePayload = { ...payload };
  delete updatePayload.name;
  const { data } = await apiClient.v6.put<IamUserToken>(
    `/me/identity/user/${userId}/token/${payload.name}`,
    updatePayload,
  );
  return data;
};

export const deleteIamUserToken = async (userId: string, token: string) => {
  const { data } = await apiClient.v6.delete<void>(
    `/me/identity/user/${userId}/token/${token}`,
  );
  return data;
};
