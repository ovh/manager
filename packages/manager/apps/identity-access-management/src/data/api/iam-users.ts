import {
  apiClient,
  ApiResponse
} from '@ovh-ux/manager-core-api';

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
}

export type IamUserToken = {
  name: string;
  description: string;
  creation: string;
  expiresAt: string;
  lastUsed: string;
}

export const getIamUser = async (userId: string) => {
  const { data } = await apiClient.v6.get<IamUser>(`/me/identity/user/${userId}`);
  return data;
};
