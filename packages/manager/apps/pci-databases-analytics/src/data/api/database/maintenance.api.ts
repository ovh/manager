import {
  apiClient,
  createHeaders,
  IcebergPaginationHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import { ServiceData } from '.';
import * as database from '@/types/cloud/project/database';

export const getMaintenances = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.service.Maintenance[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/maintenance`,
    { headers: createHeaders(NoCacheHeaders, IcebergPaginationHeaders) },
  );

export interface ApplyMaintenance extends ServiceData {
  maintenanceId: string;
}

export const applyMaintenance = async ({
  projectId,
  engine,
  serviceId,
  maintenanceId,
}: ApplyMaintenance) =>
  apiClient.v6.post<database.service.Maintenance>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/maintenance/${maintenanceId}/apply`,
  );
