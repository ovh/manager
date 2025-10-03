import {
  apiClient,
  createHeaders,
  IcebergPaginationHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import { ServiceData } from '.';
import * as database from '@/types/cloud/project/database';

export const getNamespaces = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.m3db.Namespace[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/namespace`,
    { headers: createHeaders(NoCacheHeaders, IcebergPaginationHeaders) },
  );

export interface AddNamespace extends ServiceData {
  namespace: database.m3db.NamespaceCreation;
}

export const addNamespace = async ({
  projectId,
  engine,
  serviceId,
  namespace,
}: AddNamespace) =>
  apiClient.v6.post<database.m3db.Namespace>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/namespace`,
    namespace,
  );

export type NamespaceEdition = Omit<
  database.m3db.NamespaceCreation,
  'name' | 'type' | 'resolution'
> & { resolution?: string };
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
  return apiClient.v6.put<database.m3db.Namespace>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/namespace/${id}`,
    body,
  );
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
