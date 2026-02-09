import { apiClient } from '@ovh-ux/manager-core-api';

export type IamServiceAccount = {
  clientId: string;
  name: string;
  description: string;
  callbackUrls: string[];
  flow: IamServiceAccountFlow;
  identity: string | null;
  createdAt: string;
};

export enum IamServiceAccountFlow {
  AUTHORIZATION_CODE = 'AUTHORIZATION_CODE',
  CLIENT_CREDENTIALS = 'CLIENT_CREDENTIALS',
}

export type IamServiceAccountCreationPayload = {
  name: string;
  description: string;
  callbackUrls: string[];
  flow: IamServiceAccountFlow;
};

export type IamServiceAccountSecret = {
  clientId: string;
  clientSecret: string;
};

export type IamServiceAccountUpdatePayload = {
  name: string;
  description: string;
  callbackUrls: string[];
};

export const oauthClientsRoute = '/me/api/oauth2/client';

export const getIamServiceAccount = async (clientId: string) => {
  const { data } = await apiClient.v6.get<IamServiceAccount>(
    `${oauthClientsRoute}/${clientId}`,
  );
  return data;
};

export const createIamServiceAccount = async (
  payload: IamServiceAccountCreationPayload,
) => {
  const { data } = await apiClient.v6.post<IamServiceAccountSecret>(
    oauthClientsRoute,
    payload,
  );
  return data;
};

export const updateIamServiceAccount = async (
  clientId: string,
  payload: IamServiceAccountUpdatePayload,
) => {
  await apiClient.v6.put<IamServiceAccount>(
    `${oauthClientsRoute}/${clientId}`,
    payload,
  );
};

export const deleteIamServiceAccount = async (clientId: string) => {
  const { data } = await apiClient.v6.delete<void>(
    `${oauthClientsRoute}/${clientId}`,
  );
  return data;
};
