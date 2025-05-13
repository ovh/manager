import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getAdvancedConfiguration = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/advancedConfiguration`,
      {
        headers: {
          Pragma: 'no-cache',
        },
      },
    )
    .then((res) => res.data as Record<string, string>);

export const getAdvancedConfigurationCapabilities = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/capabilities/advancedConfiguration`,
    )
    .then(
      (res) =>
        res.data as database.capabilities.advancedConfiguration.Property[],
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
  apiClient.v6
    .put(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/advancedConfiguration`,
      {
        ...advancedConfiguration,
      },
    )
    .then((res) => res.data as Record<string, string>);
