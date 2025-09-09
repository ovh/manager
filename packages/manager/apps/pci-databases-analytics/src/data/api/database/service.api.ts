import {
  apiClient,
  createHeaders,
  IcebergPaginationHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { PCIData, ServiceData } from '.';

export const getServices = async ({ projectId }: PCIData) =>
  apiClient.v6.get<database.Service[]>(
    `/cloud/project/${projectId}/database/service`,
    { headers: createHeaders(NoCacheHeaders, IcebergPaginationHeaders) },
  );

export const getService = async <
  T extends database.Service = database.Service
>({
  projectId,
  serviceId,
}: Omit<ServiceData, 'engine'>) => {
  // first fetch the basic info in services endpoint
  const serviceInfo = await apiClient.v6.get<database.Service>(
    `/cloud/project/${projectId}/database/service/${serviceId}`,
  );
  // then get the engine's specific information
  const serviceData = await apiClient.v6.get<T>(
    `/cloud/project/${projectId}/database/${serviceInfo.engine}/${serviceId}`,
  );
  return serviceData;
};

interface AddService extends Omit<ServiceData, 'serviceId'> {
  serviceInfo: Omit<
    Partial<database.ServiceCreation>,
    'ipRestrictions' | 'disk'
  > & {
    ipRestrictions?: Omit<database.service.IpRestriction, 'status'>[];
    disk?: Partial<database.service.Disk>;
  };
}
export const addService = async ({
  projectId,
  engine,
  serviceInfo,
}: AddService) =>
  apiClient.v6.post<database.Service>(
    `/cloud/project/${projectId}/database/${engine}`,
    serviceInfo,
  );

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
      | 'storage'
      | 'version'
      | 'enablePrometheus'
    > & {
      backups?: Pick<database.service.Backup, 'time'>;
    } & {
      aclsEnabled?: boolean;
    } & {
      restApi?: boolean;
    } & {
      schemaRegistry?: boolean;
    } & {
      deletionProtection?: boolean;
    }
  >;
}

export const editService = async <
  T extends database.Service = database.Service
>({
  projectId,
  engine,
  serviceId,
  data,
}: EditService) =>
  apiClient.v6.put<T>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}`,
    data,
  );

export const deleteService = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}`,
  );
