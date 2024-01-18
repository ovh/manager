import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';

export type GenericUser =
  | database.service.User
  | database.service.UserWithRoles
  | database.redis.User
  | database.opensearch.User
  | database.m3db.User;

export const getUsers = async (
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
) => {
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
        `The resource engine ${engine} does not implement the resource ${resource}`,
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
export const createUser = async (
  projectId: string,
  serviceEngine: database.EngineEnum,
  serviceId: string,
  user: UserCreation,
) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${serviceEngine}/${serviceId}/user`,
      user,
    )
    .then((res) => res.data as GenericUser);

export const deleteUser = async (
  projectId: string,
  serviceEngine: database.EngineEnum,
  serviceId: string,
  userId: string,
) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${serviceEngine}/${serviceId}/user/${userId}`,
  );

export const resetUserPassword = async (
  projectId: string,
  serviceEngine: database.EngineEnum,
  serviceId: string,
  userId: string,
) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${serviceEngine}/${serviceId}/user/${userId}/credentials/reset`,
    )
    .then((res) => res.data as database.service.UserWithPassword);
