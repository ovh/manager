import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';
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

export interface UpdateAdvancedConfigurationProps extends ServiceData {
  advancedConfiguration: Record<string, string>;
}
export const updateAdvancedConfiguration = async ({
  projectId,
  engine,
  serviceId,
  advancedConfiguration,
}: UpdateAdvancedConfigurationProps) =>
  apiClient.v6
    .put(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/advancedConfiguration`,
      {
        ...advancedConfiguration,
      },
    )
    .then((res) => res.data as Record<string, string>);
