import {
  apiClient,
  createHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getAdvancedConfiguration = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<Record<string, string>>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/advancedConfiguration`,
    { headers: createHeaders(NoCacheHeaders) },
  );

export const getAdvancedConfigurationCapabilities = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.capabilities.advancedConfiguration.Property[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/capabilities/advancedConfiguration`,
  );

export interface EditAdvancedConfiguration extends ServiceData {
  advancedConfiguration: Record<string, string>;
}
export const editAdvancedConfiguration = async ({
  projectId,
  engine,
  serviceId,
  advancedConfiguration,
}: EditAdvancedConfiguration) =>
  apiClient.v6.put<Record<string, string>>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/advancedConfiguration`,
    advancedConfiguration,
  );
