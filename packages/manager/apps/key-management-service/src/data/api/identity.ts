import apiClient, { ApiResponse } from '@ovh-ux/manager-core-api';
import {
  IdentityUser,
  IdentityGroup,
  IdentityOauthClient,
} from '@/types/identity.type';

/**
 *  Retrieve all IAM users of this account
 */

export const getIdentityUsersIds = async (): Promise<ApiResponse<string[]>> => {
  return apiClient.v6.get(`me/identity/user`);
};

export const getIdentityUsersIdsQueryKey = () => [`get/me/identity/user`];

/**
 *  Retrieve user by ID
 */

export const getIdentityUser = async (
  userId: string,
): Promise<ApiResponse<IdentityUser>> => {
  return apiClient.v6.get(`me/identity/user/${userId}`);
};

export const getIdentityUserQueryKey = (userId: string) => [
  'get/me/identity/user/',
  userId,
];

/**
 *  Retrieve all IAM groups of this account
 */

export const getIdentityGroupsIds = async (): Promise<ApiResponse<
  string[]
>> => {
  return apiClient.v6.get(`me/identity/group`);
};

export const getIdentityGroupsIdsQueryKey = () => [`get/me/identity/group`];

/**
 *  Retrieve group by ID
 */

export const getIdentityGroup = async (
  groupId: string,
): Promise<ApiResponse<IdentityGroup>> => {
  return apiClient.v6.get(`me/identity/group/${groupId}`);
};

export const getIdentityGroupQueryKey = (groupId: string) => [
  'get/me/identity/group/',
  groupId,
];

/**
 *  Retrieve all oAuth2 clients (Service Account)
 */

export const getIdentityServiceAccountsIds = async (): Promise<ApiResponse<
  string[]
>> => {
  return apiClient.v6.get(`me/api/oauth2/client`);
};

export const getIdentityServiceAccountsIdsQueryKey = () => [
  `get/me/api/oauth2/client`,
];

/**
 *  Retrieve service account by ID
 */

export const getIdentityServiceAccount = async (
  serviceAccountId: string,
): Promise<ApiResponse<IdentityOauthClient>> => {
  return apiClient.v6.get(`me/api/oauth2/client/${serviceAccountId}`);
};

export const getIdentityServiceAccountQueryKey = (serviceAccountId: string) => [
  'get/me/identity/service-account/',
  serviceAccountId,
];
