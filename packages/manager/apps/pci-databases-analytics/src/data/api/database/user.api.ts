import {
  apiClient,
  createHeaders,
  IcebergPaginationHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export type GenericUser =
  | database.service.User
  | database.service.UserWithRoles
  | database.redis.User
  | database.opensearch.User
  | database.m3db.User;

export const getUsers = async ({ projectId, engine, serviceId }: ServiceData) =>
  apiClient.v6.get<GenericUser[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/user`,
    { headers: createHeaders(NoCacheHeaders, IcebergPaginationHeaders) },
  );

export type UserCreation =
  | database.service.UserCreation
  | database.service.UserWithRolesCreation
  | database.redis.UserCreation
  | database.opensearch.UserCreation
  | database.m3db.UserCreation;
export interface AddUser extends ServiceData {
  user: UserCreation;
}
export const addUser = async ({
  projectId,
  engine,
  serviceId,
  user,
}: AddUser) =>
  apiClient.v6.post<GenericUser>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/user`,
    user,
  );

export interface DeleteUser extends ServiceData {
  userId: string;
}
export const deleteUser = async ({
  projectId,
  engine,
  serviceId,
  userId,
}: DeleteUser) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/user/${userId}`,
  );

export interface ManageUser extends ServiceData {
  userId: string;
}
export const resetUserPassword = async ({
  projectId,
  engine,
  serviceId,
  userId,
}: ManageUser) =>
  apiClient.v6.post<database.service.UserWithPassword>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/user/${userId}/credentials/reset`,
  );

export const getUserAccess = async ({
  projectId,
  engine,
  serviceId,
  userId,
}: ManageUser) =>
  apiClient.v6.get<database.kafka.user.Access>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/user/${userId}/access`,
  );

export const getRoles = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) => {
  let url = `/cloud/project/${projectId}/database/${engine}/${serviceId}/roles`;
  // For mongoDB, we need to add the advanced query param
  if (engine === database.EngineEnum.mongodb) {
    url += '?advanced=true';
  }
  return apiClient.v6.get<string[]>(url);
};

export type UserEdition = Omit<GenericUser, 'createdAt' | 'status'>;

export interface EditUser extends ServiceData {
  user: UserEdition;
}

export const editUser = async ({
  projectId,
  engine,
  serviceId,
  user,
}: EditUser) => {
  const { id, ...body } = user;
  return apiClient.v6.put<GenericUser>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/user/${id}`,
    body,
  );
};
