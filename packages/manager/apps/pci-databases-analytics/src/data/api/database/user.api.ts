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
    case database.EngineEnum.mongodb:
      userReturnType = response.data as database.service.UserWithRoles[];
      break;
    case database.EngineEnum.valkey:
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
      userReturnType = response.data as database.service.User[];
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
           .then((res: { data: GenericUser }) => res.data as GenericUser);

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
         apiClient.v6
           .post(
             `/cloud/project/${projectId}/database/${engine}/${serviceId}/user/${userId}/credentials/reset`,
           )
           .then(
             (res: { data: database.service.UserWithPassword }) =>
               res.data as database.service.UserWithPassword,
           );

export const getUserAccess = async ({
         projectId,
         engine,
         serviceId,
         userId,
       }: ManageUser) =>
         apiClient.v6
           .get(
             `/cloud/project/${projectId}/database/${engine}/${serviceId}/user/${userId}/access`,
           )
           .then(
             (res: { data: database.kafka.user.Access }) =>
               res.data as database.kafka.user.Access,
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
  return apiClient.v6
    .get(url)
    .then((res: { data: string[] }) => res.data as string[]);
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
    .then((res: { data: GenericUser }) => res.data as GenericUser);
};
