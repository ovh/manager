import { apiClient } from '@ovh-ux/manager-core-api';
import { ServiceData } from '.';
import { database } from '@/models/database';

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

export interface AddNamespaceProps extends ServiceData {
  namespace: database.m3db.NamespaceCreation;
}

export const addNamespace = async ({
  projectId,
  engine,
  serviceId,
  namespace,
}: AddNamespaceProps) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/namespace`,
      namespace,
    )
    .then((res) => res.data as database.m3db.Namespace);

export type NamespaceEdition = Omit<database.m3db.Namespace, 'name' | 'type'>;
export interface EditNamespaceProps extends ServiceData {
  namespace: NamespaceEdition;
}

export const editNamespace = async ({
  projectId,
  engine,
  serviceId,
  namespace,
}: EditNamespaceProps) => {
  const { id, ...body } = namespace;
  return apiClient.v6
    .put(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/namespace/${id}`,
      body,
    )
    .then((res) => res.data as database.m3db.Namespace);
};

export interface DeleteNamespaceProps extends ServiceData {
  namespaceId: string;
}

export const deleteNamespace = async ({
  projectId,
  engine,
  serviceId,
  namespaceId,
}: DeleteNamespaceProps) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/namespace/${namespaceId}`,
  );
