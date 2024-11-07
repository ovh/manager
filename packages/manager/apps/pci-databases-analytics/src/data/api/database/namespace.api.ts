import { apiClient } from '@ovh-ux/manager-core-api';
import { ServiceData } from '.';
import * as database from '@/types/cloud/project/database';

export const getNamespaces = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/namespace`,
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    )
    .then((res) => res.data as database.m3db.Namespace[]);

export interface AddNamespace extends ServiceData {
  namespace: database.m3db.NamespaceCreation;
}

export const addNamespace = async ({
  projectId,
  engine,
  serviceId,
  namespace,
}: AddNamespace) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/namespace`,
      namespace,
    )
    .then((res) => res.data as database.m3db.Namespace);

export type NamespaceEdition = Omit<
  database.m3db.NamespaceCreation,
  'name' | 'type'
>;
export interface EditNamespace extends ServiceData {
  namespace: NamespaceEdition;
}

export const editNamespace = async ({
  projectId,
  engine,
  serviceId,
  namespace,
}: EditNamespace) => {
  const { id, ...body } = namespace;
  return apiClient.v6
    .put(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/namespace/${id}`,
      body,
    )
    .then((res) => res.data as database.m3db.Namespace);
};

export interface DeleteNamespace extends ServiceData {
  namespaceId: string;
}

export const deleteNamespace = async ({
  projectId,
  engine,
  serviceId,
  namespaceId,
}: DeleteNamespace) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/namespace/${namespaceId}`,
  );
