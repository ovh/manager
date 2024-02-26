import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';

export const getServices = async (projectId: string) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/service`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as database.Service[]);

export const getService = async (projectId: string, serviceId: string) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/service/${serviceId}`)
    .then((res) => res.data as database.Service);

export const addService = async (
  projectId: string,
  engine: database.EngineEnum,
  serviceInfo: database.ServiceCreation,
) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/database/${engine}`, serviceInfo)
    .then((res) => res.data as database.Service);

// define which values can be updated in the update service endpoint
export interface UpdateServiceProps {
  projectId: string;
  serviceEngine: string;
  serviceId: string;
  data: Partial<
    Pick<
      database.Service,
      | 'backupTime'
      | 'backups'
      | 'description'
      | 'flavor'
      | 'ipRestrictions'
      | 'maintenanceTime'
      | 'plan'
      | 'region'
      | 'storage'
      | 'version'
    >
  >;
}

export const updateService = async ({
  projectId,
  serviceEngine,
  serviceId,
  data,
}: UpdateServiceProps) => {
  await apiClient.v6
    .put(
      `/cloud/project/${projectId}/database/${serviceEngine}/${serviceId}`,
      data,
    )
    .then((res) => res.data as database.Service[]);
};
