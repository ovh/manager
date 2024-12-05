import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export type GenericUser =
  | database.service.User
  | database.service.UserWithRoles
  | database.redis.User
  | database.opensearch.User
  | database.m3db.User;

export const getUsers = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) => {
  const resource = `/cloud/project/${projectId}/database/${engine}/${serviceId}/user`;
  const headers: Record<string, string> = {
    'X-Pagination-Mode': 'CachedObjectList-Pages',
    'X-Pagination-Size': '50000',
    Pragma: 'no-cache',
  };
  const response = await apiClient.v6.get(resource, { headers });
  // Returned data type depends of service's engine
  let userReturnType: GenericUser[];
  switch (engine) {
    case database.EngineEnum.mysql:
    case database.EngineEnum.postgresql:
    case database.EngineEnum.kafka:
    case database.EngineEnum.cassandra:
    case database.EngineEnum.kafkaConnect:
    case database.EngineEnum.grafana:
      userReturnType = response.data as database.service.User[];
      break;
    case database.EngineEnum.mongodb:
      userReturnType = response.data as database.service.UserWithRoles[];
      break;
    case database.EngineEnum.redis:
      userReturnType = response.data as database.redis.User[];
      break;
    case database.EngineEnum.opensearch:
      userReturnType = response.data as database.opensearch.User[];
      break;
    case database.EngineEnum.m3db:
      userReturnType = response.data as database.m3db.User[];
      break;
    default:
      throw new Error(
        `The engine ${engine} does not implement the resource ${resource}`,
      );
  }
  return userReturnType;
};

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
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/user`,
      user,
    )
    .then((res) => res.data as GenericUser);

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

export interface ResetUserPassword extends ServiceData {
  userId: string;
}
export const resetUserPassword = async ({
  projectId,
  engine,
  serviceId,
  userId,
}: ResetUserPassword) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/user/${userId}/credentials/reset`,
    )
    .then((res) => res.data as database.service.UserWithPassword);

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
  return apiClient.v6.get(url).then((res) => res.data as string[]);
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
  return apiClient.v6
    .put(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/user/${id}`,
      body,
    )
    .then((res) => res.data as GenericUser);
};
