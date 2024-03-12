import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';
import { PCIData, ServiceData } from '.';

export const getServices = async ({ projectId }: PCIData) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/service`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as database.Service[]);

export const getService = async ({
  projectId,
  serviceId,
}: Omit<ServiceData, 'engine'>) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/service/${serviceId}`)
    .then((res) => res.data as database.Service);

interface AddServiceProps extends Omit<ServiceData, 'serviceId'> {
  serviceInfo: database.ServiceCreation;
}
export const addService = async ({
  projectId,
  engine,
  serviceInfo,
}: AddServiceProps) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/database/${engine}`, serviceInfo)
    .then((res) => res.data as database.Service);

// define which values can be updated in the update service endpoint
export interface UpdateServiceProps extends ServiceData {
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
  engine,
  serviceId,
  data,
}: UpdateServiceProps) =>
  apiClient.v6
    .put(`/cloud/project/${projectId}/database/${engine}/${serviceId}`, data)
    .then((res) => res.data as database.Service);
