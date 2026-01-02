import {
  IdentityGroup,
  IdentityOauthClient,
  IdentityUser,
} from '@key-management-service/types/identity.type';

import apiClient from '@ovh-ux/manager-core-api';

/**
 *  Retrieve all IAM users of this account
 */

export const getIdentityUsersIds = async (): Promise<string[]> => {
  const { data } = await apiClient.v6.get<string[]>(`me/identity/user`);
  return data;
};

export const getIdentityUsersIdsQueryKey = () => [`get/me/identity/user`];

/**
 *  Retrieve user by ID
 */

export const getIdentityUser = async (userId: string): Promise<IdentityUser> => {
  const { data } = await apiClient.v6.get<IdentityUser>(`me/identity/user/${userId}`);
  return data;
};

export const getIdentityUserQueryKey = (userId: string) => ['get/me/identity/user/', userId];

/**
 *  Retrieve all IAM groups of this account
 */

export const getIdentityGroupsIds = async (): Promise<string[]> => {
  const { data } = await apiClient.v6.get<string[]>(`me/identity/group`);
  return data;
};

export const getIdentityGroupsIdsQueryKey = () => [`get/me/identity/group`];

/**
 *  Retrieve group by ID
 */

export const getIdentityGroup = async (groupId: string): Promise<IdentityGroup> => {
  const { data } = await apiClient.v6.get<IdentityGroup>(`me/identity/group/${groupId}`);
  return data;
};

export const getIdentityGroupQueryKey = (groupId: string) => ['get/me/identity/group/', groupId];

/**
 *  Retrieve all oAuth2 clients (Service Account)
 */

export const getIdentityServiceAccountsIds = async (): Promise<string[]> => {
  const { data } = await apiClient.v6.get<string[]>(`me/api/oauth2/client`);
  return data;
};

export const getIdentityServiceAccountsIdsQueryKey = () => [`get/me/api/oauth2/client`];

/**
 *  Retrieve service account by ID
 */

export const getIdentityServiceAccount = async (
  serviceAccountId: string,
): Promise<IdentityOauthClient> => {
  const { data } = await apiClient.v6.get<IdentityOauthClient>(
    `me/api/oauth2/client/${serviceAccountId}`,
  );
  return data;
};

export const getIdentityServiceAccountQueryKey = (serviceAccountId: string) => [
  'get/me/identity/service-account/',
  serviceAccountId,
];
