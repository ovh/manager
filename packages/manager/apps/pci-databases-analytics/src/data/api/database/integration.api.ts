import {
  apiClient,
  createHeaders,
  IcebergPaginationHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getServiceIntegrations = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.service.Integration[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/integration`,
    { headers: createHeaders(NoCacheHeaders, IcebergPaginationHeaders) },
  );

export const getServiceCapabilitiesIntegrations = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.capabilities.Integration[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/capabilities/integration`,
    { headers: createHeaders(NoCacheHeaders, IcebergPaginationHeaders) },
  );

export interface AddIntegration extends ServiceData {
  integration: Omit<database.service.Integration, 'id' | 'status'>;
}
export const addIntegration = async ({
  projectId,
  engine,
  serviceId,
  integration,
}: AddIntegration) =>
  apiClient.v6.post<database.service.Integration>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/integration`,
    integration,
  );

export interface DeleteIntegration extends ServiceData {
  integrationId: string;
}
export const deleteIntegration = async ({
  integrationId,
  engine,
  projectId,
  serviceId,
}: DeleteIntegration) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/integration/${integrationId}`,
  );
