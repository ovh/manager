import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
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

interface AddService extends Omit<ServiceData, 'serviceId'> {
  serviceInfo: Partial<database.ServiceCreation>;
}
export const addService = async ({
  projectId,
  engine,
  serviceInfo,
}: AddService) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/database/${engine}`, serviceInfo)
    .then((res) => res.data as database.Service);

// define which values can be updated in the update service endpoint
export interface EditService extends ServiceData {
  data: Partial<
    Pick<
      database.Service,
      | 'description'
      | 'flavor'
      | 'ipRestrictions'
      | 'maintenanceTime'
      | 'plan'
      | 'region'
      | 'storage'
      | 'version'
    > & {
      backups?: Pick<database.service.Backup, 'time'>;
    }
  >;
}

export const editService = async ({
  projectId,
  engine,
  serviceId,
  data,
}: EditService) =>
  apiClient.v6
    .put(`/cloud/project/${projectId}/database/${engine}/${serviceId}`, data)
    .then((res) => res.data as database.Service);

export const deleteService = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}`,
  );
